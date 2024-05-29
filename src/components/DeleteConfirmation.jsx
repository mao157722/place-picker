import { useEffect } from "react";
import ProgressBar from "./ProgressBar.jsx";

const TIMER = 3000;
export default function DeleteConfirmation({ onConfirm, onCancel }) {
  

  useEffect(() => {
    console.log('TIMER SET');
    const myTimer = setTimeout(() => {
      onConfirm();
    }, TIMER);
    return () => {
      console.log('clean up timer');
      clearTimeout(myTimer);
    }
  }, []);
  // กรณีนี้ dependency เป็น function onConfirm จะทำให้เกิด infinity loop
  // แก้ไขที่ต้นทางได้โดยการใช้ useCallBack ไปครอบไว้ที่ตัว function onConfirm ถูกสร้างขึ้น
  // ก็คือ ที่ App component ชื่อ handleRemovePlace 

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar timer={TIMER} />
    </div>
  );
}
