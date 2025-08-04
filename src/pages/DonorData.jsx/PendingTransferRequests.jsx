import React, { useEffect, useState } from "react";
import {
  getPendingDonorTransfers,
  approveDonorAcquire,
  approveDonorRelease,
} from "../../utils/services";
import { getDonorCultivatorIdFromLocalStorage } from "../../utils/services";

const PendingTransferRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const cultivatorId = getDonorCultivatorIdFromLocalStorage();

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const all = await getPendingDonorTransfers(cultivatorId);
      const incoming = all.filter((req) => req.requestedTo?.id === cultivatorId);
      const outgoing = all.filter((req) => req.requestedBy?.id === cultivatorId);

      setPendingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleApprove = async (req) => {
    try {
      if (req.requestType === "ACQUIRE") {
        await approveDonorAcquire(req.donor.id, req.requestedBy.id, req.requestedTo.id);
      } else if (req.requestType === "RELEASE") {
        await approveDonorRelease(req.donor.id, req.requestedBy.id, req.requestedTo.id);
      }
      alert("Request approved successfully");
      fetchPendingRequests(); // refresh
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="mt-6 max-w-4xl mx-auto">
      {/* Section 1: Requests You Need to Approve */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-purple-800">Requests That Require Your Approval</h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-500">No incoming requests for approval.</p>
        ) : (
          <ul className="space-y-4">
            {pendingRequests.map((req) => (
              <li key={req.id} className="p-4 bg-white rounded shadow border">
                <div><strong>Donor:</strong> {req.donor?.name}</div>
                <div><strong>Type:</strong> {req.requestType}</div>
                <div><strong>Requested By:</strong> {req.requestedBy?.name}</div>
                <div><strong>Requested To (You):</strong> {req.requestedTo?.name}</div>
                <button
                  onClick={() => handleApprove(req)}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Section 2: Requests You Have Made */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-blue-800">
          Requests You Have Made to Other Cultivators
        </h2>
        {outgoingRequests.length === 0 ? (
          <p className="text-gray-500">You have not made any transfer requests.</p>
        ) : (
          <ul className="space-y-4">
            {outgoingRequests.map((req) => (
              <li key={req.id} className="p-4 bg-white rounded shadow border">
                <div><strong>Donor:</strong> {req.donor?.name}</div>
                <div><strong>Type:</strong> {req.requestType}</div>
                <div><strong>You (Requested By):</strong> {req.requestedBy?.name}</div>
                <div><strong>Requested To:</strong> {req.requestedTo?.name}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PendingTransferRequests;
