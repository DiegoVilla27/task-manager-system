import StorageService from "@shared/utils/storage";
import { Navigate, Outlet } from "react-router-dom";

const PrivateGuard = () => {
  const token = StorageService.get<string>("TOKEN");

  if (token) {
    return <Outlet />;
  }

  return <Navigate to="/auth/login" replace />;

}

export default PrivateGuard;