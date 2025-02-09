import { useEffect } from 'react';

const useFetchCityAndState = (pincode, setValue) => {
    useEffect(() => {
        const fetchCityAndState = async () => {
            if (/^[0-9]{6}$/.test(pincode)) {
                try {
                    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                    const data = await response.json();

                    if (data && data.length > 0 && data[0].Status === "Success") {
                        const postOffice = data[0].PostOffice?.[0]; // Get first PostOffice entry
                        if (postOffice) {
                            setValue('city', postOffice.District);  // City is the Post Office name
                            setValue('state', postOffice.State);
                        }
                    } else {
                        console.warn('Invalid Pincode or No Data Found');
                    }
                } catch (error) {
                    console.error('Error fetching city and state:', error);
                }
            }
        };

        fetchCityAndState();
    }, [pincode, setValue]);
};

export default useFetchCityAndState;
