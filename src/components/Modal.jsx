import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, children, onClose }) {
  const dialog = useRef();
  
  useEffect(() => {
    if (open) {
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
  }, [open]); 
  // ถ้าเรามีการเรียกใช้ prop หรือ state value ใน use effect เราต้อง set arg2 ด้วย ไม่ใช่แค่ []
  // รอบนี้ต้องการ dependecy เพราะ prop open มีการเปลี่ยนแปลง
  // เมื่อ prop open มีการเปลี่ยนแปลงให้ execute code arg1 ใน useEffect อีกที
  // ถ้าเราใส่เป็น [] ว่าง มันจะไม่โดน execute อีกเลยเพราะตามกฎ มันจะทำครั้งเดียวถ้าเป็น []

  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose} >
      { open ? children : null}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;
