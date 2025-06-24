import { useLoading } from "./LoadingContext";
import Loading from "../components/Loading";

const GlobalLoader = () => {
  const { loading } = useLoading();

  return (
    loading && (
      <div className="loader-container">
        <Loading></Loading>
      </div>
    )
  );
};

export default GlobalLoader;
