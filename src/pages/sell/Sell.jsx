import React, { useEffect, useState } from 'react';
import Card from '../../components/card/Card';
import PageMenu from '../../components/pageMenu/PageMenu';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RESET, createOrder } from '../../redux/features/auth/orderSlice';
import { toast } from 'react-toastify';
import { fetchCollectorsAsync } from '../../redux/features/auth/collectorService';
import "react-confirm-alert/src/react-confirm-alert.css";
import { confirmAlert } from 'react-confirm-alert'

const initialState = {
  type: '',
  weight: '',
  amount: '',
  phone: '',
  address: '',
  sellerEmail: ''
};

const Sell = () => {
  const { isLoading, isSuccess} = useSelector((state) => state.order);
  const { collectors, isError } = useSelector((state) => state.collector);
  
  const {user} = useSelector((state) => state.auth)


  const [formData, setFormData] = useState(initialState);
  const { type, weight, amount, phone, address, sellerEmail } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to calculate the updated amount based on the weight input value
  const calculateAmount = (value) => {
    if (value === '') {
      return '';
    } else {
      const parsedWeight = parseInt(value, 10);
      const updatedAmount = parsedWeight === 1 ? 150 : 150 * parsedWeight;
      return updatedAmount.toString();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'weight') {
      setFormData({ ...formData, [name]: value, amount: calculateAmount(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const orderGo = async (e) => {
    e.preventDefault();

    const orderData = {
      type,
      weight,
      amount,
      phone,
      address,
      sellerEmail
    };
    
    
    await dispatch(createOrder(orderData));  
  };
  
  const fetchData = async (e) => {
    e.preventDefault()
    if (!type || !weight || !amount || !phone) {
      return toast.error('All fields are required');
    }

    if (parseFloat(weight) < 1) {
      return toast.error('Weight must be at least 1');
    }
    await dispatch(fetchCollectorsAsync());
  }

 

  useEffect(() => {
    if (isSuccess) {
      navigate('/profile');
    }
    dispatch(RESET());
  }, [isSuccess, dispatch, navigate]);

  return (
    <>
      <section className='top'>
        <div className='container'>
          <PageMenu />
          
          <div>
            <h2>Sell</h2>

            <div className='--flex-start profile'>
              

              <Card cardClass={'card'}>
                <form onSubmit={fetchData}>
                  <p>
                    <label>Specify type:</label>
                    <input type='text' name='type' value={type} onChange={handleInputChange} placeholder='e.g Bigi plastic bottles' />
                  </p>

                  <p>
                    <label>Weight (kg):</label>
                    <input type='text' name='weight' value={weight || 1} onChange={handleInputChange} placeholder='enter total weight' />
                  </p>

                  {formData.amount !== '' && (
                    <p>
                      Amount: #{formData.amount} 
                    </p>
                  )}

                  <p>
                    <label>Phone Num:</label>
                    <input type='text' name='phone' value={phone} onChange={handleInputChange} placeholder='081000000000' />
                  </p>

                  <p>
                    <label>Email:</label>
                    <input type='text' name='sellerEmail' value={sellerEmail} onChange={handleInputChange} placeholder='yourname@gmail.com' />
                  </p>

                  <p>
                    <label>Address:</label>
                    <input type='text' name='address' value={address} onChange={handleInputChange}/>
                  </p>

                  <button className='--btn --btn-success --btn-block'>Fetch Collectors</button>
                </form>
              </Card>

            </div>
          </div>

          <div className='profile top'>
              <Card cardClass={'card'}>
                <h3>Collectors</h3>    
                <hr/>
                {isLoading ? (
                  <p>Loading...</p>
                ) : isError ? (
                  <p>Error fetching collectors.</p>
                ) : (
                    <p className='--mt'>
                      {collectors.map((collector) => (
                      <>
                        Name: {collector.name}<br/>
                        Email: {collector.email}<br/>
                        Phone: {collector.phone}<br/>
                        Address: {collector.address}<br/>
                        <button className='--btn --btn-primary' onClick={orderGo}>Create Order</button>
                            
                        <hr/>
                      </>
                      ))}
                      </p>
                    
                  )}
              </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default Sell;
