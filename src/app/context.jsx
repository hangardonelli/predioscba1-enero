import React, { useState, useEffect } from "react";

const localUser = JSON.parse(localStorage.getItem('user'));
const DataContext = React.createContext();

const DataProvider = (props) => {
  const [user, setUser] = useState(localUser || null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  });
  
  return (
    <DataContext.Provider value={{user, setUser}}>
      {props.children}
    </DataContext.Provider>
  );
}

export {DataContext, DataProvider};