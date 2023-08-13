import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const [seconds, setSeconds] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/");
    }, 10_000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div>
      <h1>An error occured</h1>
      <p>You will be redirected in {seconds} seconds to main page</p>
    </div>
  );
}
