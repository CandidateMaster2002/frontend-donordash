import React, { useEffect, useState } from 'react';
import {
  getPendingDonorTransfers,
  approveDonorAcquire,
  approveDonorRelease,
} from '../../utils/services';
import { getDonorCultivatorIdFromLocalStorage } from '../../utils/services';
import { toast } from 'react-toastify';

const PendingTransferRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const cultivatorId = getDonorCultivatorIdFromLocalStorage();

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    setIsFetching(true);
    try {
      const all = await getPendingDonorTransfers(cultivatorId);
      const requests = Array.isArray(all.data) ? all.data : [];

      const incoming = requests.filter(
        (req) => req.requestedToId === cultivatorId
      );
      const outgoing = requests.filter(
        (req) => req.requestedById === cultivatorId
      );

      setPendingRequests(incoming);
      setOutgoingRequests(outgoing);
    } catch (error) {
      toast.error(error?.message || 'Failed to fetch requests');
    } finally {
      setIsFetching(false);
    }
  };

  const handleApprove = async (req) => {
    setApprovingId(req.id);
    try {
      if (req.requestType === 'ACQUIRE') {
        await approveDonorAcquire(
          req.donorId,
          req.requestedById,
          req.requestedToId
        );
      } else if (req.requestType === 'RELEASE') {
        await approveDonorRelease(
          req.donorId,
          req.requestedById,
          req.requestedToId
        );
      }

      fetchPendingRequests();
      toast.success('Request approved successfully');
    } catch (err) {
      toast.error(err?.message || 'Approval failed');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="mt-6 max-w-4xl mx-auto">
      {/* Section 1: Requests You Need to Approve */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4 text-purple-800">
          Requests That Require Your Approval
        </h2>
        {isFetching ? (
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <span className="h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            Fetching incoming requests...
          </div>
        ) : pendingRequests.length === 0 ? (
          <p className="text-gray-500">No incoming requests for approval.</p>
        ) : (
          <ul className="space-y-4">
            {pendingRequests.map((req) => (
              <li key={req.id} className="p-4 bg-white rounded shadow border">
                <div>
                  <strong>Donor:</strong> {req.donorName}
                </div>
                <div>
                  <strong>Type:</strong> {req.requestType}
                </div>
                <div>
                  <strong>Requested By:</strong> {req.requestedByName}
                </div>
                <div>
                  <strong>Requested To (You):</strong> {req.requestedToName}
                </div>
                <button
                  onClick={() => handleApprove(req)}
                  disabled={approvingId === req.id}
                  className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                >
                  {approvingId === req.id && (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  {approvingId === req.id ? 'Approving...' : 'Approve'}
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
        {isFetching ? (
          <div className="inline-flex items-center gap-2 text-sm text-gray-600">
            <span className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Fetching outgoing requests...
          </div>
        ) : outgoingRequests.length === 0 ? (
          <p className="text-gray-500">
            You have not made any transfer requests.
          </p>
        ) : (
          <ul className="space-y-4">
            {outgoingRequests.map((req) => (
              <li key={req.id} className="p-4 bg-white rounded shadow border">
                <div>
                  <strong>Donor:</strong> {req.donorName}
                </div>
                <div>
                  <strong>Type:</strong> {req.requestType}
                </div>
                <div>
                  <strong>You (Requested By):</strong> {req.requestedByName}
                </div>
                <div>
                  <strong>Requested To:</strong> {req.requestedToName}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PendingTransferRequests;
