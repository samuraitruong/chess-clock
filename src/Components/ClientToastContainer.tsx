"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientToastContainer() {
  return <ToastContainer theme="colored" autoClose={1000} limit={1} />;
}
