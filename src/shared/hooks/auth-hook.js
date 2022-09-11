import React, { useCallback, useEffect, useState } from "react";
export const useAuth = () => {
  let logoutTimer;
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState();
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const Login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);
  const Logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remaningtime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(Logout, remaningtime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, Logout, tokenExpirationDate]);
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      Login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [Login]);
  return { Login, token, Logout, userId };
};
