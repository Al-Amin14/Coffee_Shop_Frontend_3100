import { useEffect, useState } from "react";
import AuthUser from "./AuthUser";

export default function Dashboard() {
  const { http } = AuthUser();
  const [userdetail, setUserdetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetail();
  }, []);

  const fetchUserDetail = () => {
    setLoading(true);
    http
      .post("/me")
      .then((res) => setUserdetail(res.data))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-3">
        Dashboard
      </h1>

      {/* Loading state */}
      {loading ? (
        <p className="text-gray-500">Loading your profile...</p>
      ) : (
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            User Information
          </h2>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase">
                Name
              </h4>
              <p className="text-lg font-semibold text-gray-800">
                {userdetail?.name || "N/A"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase">
                Email
              </h4>
              <p className="text-lg font-semibold text-gray-800">
                {userdetail?.email || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
