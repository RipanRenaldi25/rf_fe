import React from "react";

export const ModalContext = React.createContext({
  showModal: false,
  setShowModal: (value: boolean) => {},
  showAddRact: false,
  setShowAddRact: (value: boolean) => {},
});
