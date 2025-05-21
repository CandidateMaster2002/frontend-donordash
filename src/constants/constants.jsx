import easy from "../assets/images/easy.jpg";
import mandir from "../assets/images/mandir.jpg";
import bbt from "../assets/images/bbt.jpg";
import houseProgram from "../assets/images/house_program.jpg";
import mahaprasad from "../assets/images/mahaprasad.jpg";
import sunday_feast from "../assets/images/sunday_feast.jpg";
import nitya_seva from "../assets/images/nitya_seva.jpg";
import janmashtami from "../assets/images/janmashtami.png";
import rathYtra from "../assets/images/rath_yatra.jpg";
import fruitSeller from "../assets/images/fruitseller.jpg";


export const donationAmounts = [
  { id: 2, value: 501 },
  { id: 3, value: 1001 },
  {id:4,value:5001},
];

export const paymentModes = [
  { id: 1, value: "Cash" },
  { id: 2, value: "Bank Transfer" },
  { id: 3, value: "Cheque" },
  { id: 4, value: "Online(Razorpay)" },
];

export const zones = [
  { id: 1, value: "Jagjeevan Nagar" },
  { id: 2, value: "Saraidhela" },
  { id: 3, value: "Steel Gate" },
  { id: 4, value: "Govindpur" },
  { id: 5, value: "Bank More" },
  { id: 6, value: "Jharia" },
  { id: 7, value: "City Center" },
  { id: 8, value: "Bekarbandh" },
  { id: 9, value: "Memko More" },
  { id: 10, value: "Other" },
];

export const paymentStatuses = [
  { id: 1, value: "Pending" },
  { id: 2, value: "Verified" },
  { id: 3, value: "Failed" },
  { id: 4, value: "Cancelled" },
];

export const donationPurposes = [
  { id: 2, value: "Easy Donation ISM Voice", imgAddress: easy },
  { id: 3, value: "Easy Donation BIT Sindri Voice", imgAddress: easy },
  { id: 4, value: "Sunday Feast", imgAddress: sunday_feast },
  {id:5,value:"Nitya Seva",imgAddress:nitya_seva},
  { id: 6, value: "Mahaprasad (Sponsorship)", imgAddress: mahaprasad },
  { id: 7, value: "Spiritual Books (Sponsorship)", imgAddress: bbt },
  { id: 8, value: "House Program", imgAddress: houseProgram },
  { id: 9, value: "Temple Construction", imgAddress: mandir },
  {id:10,value:"Janmashtami",imgAddress:janmashtami},
  {id:11,value:"RathYatra",imgAddress:rathYtra},
  { id:12, value: "Other", imgAddress:fruitSeller },

];
