import easy from '../assets/images/easy.jpg';
import mandir from '../assets/images/mandir.jpg';
import bbt from '../assets/images/bbt.jpg';
import houseProgram from '../assets/images/house_program.jpg';
import mahaprasad from '../assets/images/mahaprasad.jpg';
import sunday_feast from '../assets/images/sunday_feast.jpg';
import nitya_seva from '../assets/images/nitya_seva.jpg';
import janmashtami from '../assets/images/janmashtami.png';
import rathYtra from '../assets/images/rath_yatra.jpg';
import fruitSeller from '../assets/images/fruitseller.jpg';
import qrImage from '../assets/images/iskcon_dhanbad_payment_qr.jpeg';

export const donationAmounts = [
  { id: 2, value: 501 },
  { id: 3, value: 1001 },
  { id: 4, value: 5001 },
];

export const paymentModes = [
  { id: 1, label: '🔥 Online - Preferred', value: 'Razorpay' },
  { id: 2, label: 'Cash', value: 'Cash' },
  { id: 3, label: 'UPI/NEFT/IMPS - Bank Transfer', value: 'Bank Transfer' },
  { id: 4, label: 'Cheque', value: 'Cheque' },
  { id: 5, label: 'Razorpay Link', value: 'Razorpay Link' },
];

export const zones = [
  { id: 1, value: 'Jagjeevan Nagar' },
  { id: 2, value: 'Saraidhela' },
  { id: 3, value: 'Steel Gate' },
  { id: 4, value: 'Govindpur' },
  { id: 5, value: 'Bank More' },
  { id: 6, value: 'Jharia' },
  { id: 7, value: 'City Center' },
  { id: 8, value: 'Bekarbandh' },
  { id: 9, value: 'Memko More' },
  { id: 10, value: 'Other' },
];

export const paymentStatuses = [
  { id: 1, value: 'Pending' },
  { id: 2, value: 'Verified' },
  { id: 3, value: 'Failed' },
  { id: 4, value: 'Cancelled' },
];

export const donationPurposes = [
  {
    id: 2,
    value: 'Easy Donation ISM Voice',
    imgAddress: easy,
    costCenter: 'ISM Voice',
  },
  {
    id: 3,
    value: 'Easy Donation BIT Sindri Voice',
    imgAddress: easy,
    costCenter: 'BIT Sindri Voice',
  },
  {
    id: 4,
    value: 'Sunday Feast',
    imgAddress: sunday_feast,
    costCenter: 'ISKCON Dhanbad',
  },
  {
    id: 5,
    value: 'Nitya Seva',
    imgAddress: nitya_seva,
    costCenter: 'Nitya Seva',
  },
  {
    id: 6,
    value: 'Mahaprasad (Sponsorship)',
    imgAddress: mahaprasad,
    costCenter: 'Kitchen',
  },
  {
    id: 7,
    value: 'Spiritual Books (Sponsorship)',
    imgAddress: bbt,
    costCenter: 'BBT',
  },
  {
    id: 8,
    value: 'House Program',
    imgAddress: houseProgram,
    costCenter: 'ISKCON Dhanbad',
  },
  {
    id: 9,
    value: 'Temple Construction',
    imgAddress: mandir,
    costCenter: 'JJN Development',
  },
  {
    id: 10,
    value: 'Janmashtami',
    imgAddress: janmashtami,
    costCenter: 'ISKCON Dhanbad',
  },
  {
    id: 11,
    value: 'RathYatra',
    imgAddress: rathYtra,
    costCenter: 'ISKCON Dhanbad',
  },
  { id: 12, value: 'Girls Voice', imgAddress: easy, costCenter: 'Girls Voice' },
  {
    id: 13,
    value: 'Tribal Care',
    imgAddress: fruitSeller,
    costCenter: 'Tribal Care',
  },
  {
    id: 14,
    value: 'CSR Donation',
    imgAddress: fruitSeller,
    costCenter: 'ISKCON Dhanbad',
  },
  {
    id: 15,
    value: 'Other',
    imgAddress: fruitSeller,
    costCenter: 'ISKCON Dhanbad',
  },
];

export const whiteListedDonationPurposes = [
  { id: 14, value: 'CSR Donation', imgAddress: fruitSeller },
];

export const bankDetails = {
  ifsc: 'ICIC0000196',
  accountNo: '019601009491',
  accountName: 'ISKCON',
  upiId: 'iskcon.eazypay@icici',
  mobileNumber: '7644070770',
  qrImage: { qrImage },
};
