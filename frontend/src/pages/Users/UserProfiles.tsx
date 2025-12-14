// import { Link } from "react-router";
import UserInfoCard from "./UserInfoCard";
// import { FaArrowAltCircleLeft } from "react-icons/fa";

export default function UserProfiles() {
  return (
    <>
      <div className="w-screen h-screen border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <div className="space-y-6">
          <UserInfoCard />
        </div>
      </div>
    </>
  );
}
