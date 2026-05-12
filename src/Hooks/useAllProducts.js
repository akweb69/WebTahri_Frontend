import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useAllProducts = () => {
  const base_url = import.meta.env.VITE_BASE_URL;

  const {
    data: products = [],
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const res = await axios.get(`${base_url}/website-product`);
      return res.data;
    },
  });

  return {
    products,
    isLoading,
    refetch,
    error,
  };
};

export default useAllProducts;
