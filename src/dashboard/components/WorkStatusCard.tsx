import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DashboardRootState, DashboardDispatch } from "../store";
import { updateWorkStatus } from "../store/userSlice";
import { WorkStatus } from "../../shared/types";

const statusLabels: Record<WorkStatus, string> = {
  looking: "Currently looking for work",
  passive: "Passively looking for work",
  not_looking: "Don't want to hear about work",
};

const statuses: WorkStatus[] = ["looking", "passive", "not_looking"];

export const WorkStatusCard = ({ className = "" }: { className?: string }) => {
  const { profile } = useSelector((state: DashboardRootState) => state.user);
  const dispatch = useDispatch<DashboardDispatch>();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<WorkStatus>(
    profile.workStatus
  );

  useEffect(() => {
    setSelectedStatus(profile.workStatus);
    setIsEditing(false);
  }, [profile.workStatus]);

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 h-full ${className}`}>
      <h3 className="text-lg font-medium mb-4 pb-3 border-b border-gray-200">
        Your Work Status
      </h3>
      <div className="py-2">
        <div className="flex flex-col gap-2 mb-4">
          {statuses.map((status) => (
            <label
              key={status}
              className={`flex items-center gap-3 p-3 rounded border transition-colors ${
                isEditing ? "cursor-pointer" : "cursor-default opacity-60"
              } ${
                selectedStatus === status
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="workStatus"
                value={status}
                checked={selectedStatus === status}
                onChange={() => setSelectedStatus(status)}
                disabled={!isEditing}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedStatus === status
                    ? "border-blue-600 bg-white"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selectedStatus === status && (
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </span>
              <span className="text-sm">{statusLabels[status]}</span>
            </label>
          ))}
        </div>
        <button
          onClick={() => {
            if (isEditing) {
              dispatch(updateWorkStatus(selectedStatus));
              setIsEditing(false);
            } else {
              setIsEditing(true);
            }
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white border-none py-3 rounded text-sm cursor-pointer transition-colors"
        >
          {isEditing ? "Save your availability" : "Update your availability"}
        </button>
      </div>
    </div>
  );
};
