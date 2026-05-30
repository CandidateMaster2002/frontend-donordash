import { useEffect } from 'react';

const PINCODE_API_BASE = 'https://postal-pincode-api.vercel.app/api/v1/pincode';

const setValueOptions = { shouldValidate: true, shouldDirty: true };

const toTitleCase = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const useFetchCityAndState = (pincode, setValue) => {
  useEffect(() => {
    const normalizedPincode = String(pincode ?? '').trim();

    if (!/^[0-9]{6}$/.test(normalizedPincode)) {
      setValue('city', '', setValueOptions);
      setValue('state', '', setValueOptions);
      return;
    }

    const controller = new AbortController();

    const fetchCityAndState = async () => {
      try {
        const response = await fetch(
          `${PINCODE_API_BASE}/${normalizedPincode}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Pincode lookup failed (${response.status})`);
        }

        const result = await response.json();
        const firstOffice = result?.data?.[0];

        if (firstOffice?.district && firstOffice?.state) {
          setValue('city', toTitleCase(firstOffice.district), setValueOptions);
          setValue('state', toTitleCase(firstOffice.state), setValueOptions);
        } else {
          setValue('city', '', setValueOptions);
          setValue('state', '', setValueOptions);
          console.warn('Invalid pincode or no data found');
        }
      } catch (error) {
        if (error.name === 'AbortError') return;

        setValue('city', '', setValueOptions);
        setValue('state', '', setValueOptions);
        console.error('Error fetching city and state:', error);
      }
    };

    fetchCityAndState();

    return () => controller.abort();
  }, [pincode, setValue]);
};

export default useFetchCityAndState;
