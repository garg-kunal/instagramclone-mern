import { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  //   const authState = useSelector((state: RootState) => state.auth);

  //   if (!authState.isAuthenticated) {
  //     return <Navigate to="/login" replace />;
  //   }

  return <>{children}</>;
}
