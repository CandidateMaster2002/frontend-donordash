import DonorDonationHistory from '../DonorData/components/DonorDonationHistory';
import { getDonorIdFromLocalStorage } from '../../utils/services';

const DonationHistory = () => {
  const donorId = getDonorIdFromLocalStorage();

  return (
    <div className="overflow-x-auto max-w-full p-3 sm:p-4 md:p-6">
      <DonorDonationHistory donorId={donorId} />
    </div>
  );
};

export default DonationHistory;
