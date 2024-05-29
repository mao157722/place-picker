import { useCallback, useEffect, useRef, useState } from 'react';

import Places from './components/Places.jsx';
import { AVAILABLE_PLACES } from './data.js';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import { sortPlacesByDistance } from './loc.js'

const storedIds = JSON.parse(
  localStorage.getItem('selectedPlaces')
) || [];
const storedPlaces = storedIds.map((id) => AVAILABLE_PLACES.find((place)=>place.id === id));

//useEffect เอามาแก้ปัญฆา side effect ที่อาจเกิดขึ้นได้
//side effect อาจเกิดเมื่อมีการทำงาน re-execute ทำให้เกิด loop ไม่รู้จบทำให้ app พัง

function App() {
  const selectedPlace = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [availabelPlaces, setAvailabelPlaces] = useState([]);
  // เอา storedPlaces จาก localStorage มายัดแทนเลย แทนการใช้ useEffect
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces); 

  

  // useEffect จะทำการ exexute code ใน argument แรก 
  // หลังจากที่ ทุก component ถูก execute เสร็จหมดแล้ว ทำให้ไม่เกิด infinity loop
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES,
        position.coords.latitude,
        position.coords.longitude);

      setAvailabelPlaces(sortedPlaces);
    });
  }, []); // argument ที่ 2 dependencies จำเป็นมากในการทำให้ไม่เกิด loop ไม่รู้จบ


  //การใช้ useEffect นี้ไม่จำเป็นเพราะ code ใน arg 1 เราเป็น async มันจะทำก่อนที่ app component จะโดน exexute เสร็จอีก
  //ให้เราแก้โดนการไม่ใช้ useEffect แล้วย้าย code นี้ไปนอก app component function execute แทน
  //นี่จึงเป็นเหตุผมที่ว่า case นี้ไม่ต้องใช้ useEffect เพื่อให้มันทำงานครั้งเดียวก็ได้
  //จึงเป็นที่มาของ side effect บางกรณีไม่จำเป็นต้องใช้ useEffect เพื่อแก้ปัญหาก็ได้
  //ย้ายไปใช้ code บรรทัดที่ 10 แทนตัว useEffect นี้
  /*
  useEffect(()=>{
    const storedIds = JSON.parse(
      localStorage.getItem('selectedPlaces')
    ) || [];
    const storedPlaces = storedIds.map((id) => AVAILABLE_PLACES.find((place)=>place.id === id));
    setPickedPlaces(storedPlaces);
  }, []);
   */

  function handleStartRemovePlace(id) {
    setModalIsOpen(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storedIds = JSON.parse(
      localStorage.getItem('selectedPlaces')
    ) || [];
    if(storedIds.indexOf(id) === -1) {
      localStorage.setItem('selectedPlaces',
        JSON.stringify([id, ...storedIds])
      );
    }
  }

  // useCallback มาเพื่อทำไม่ให้ function นี้ถูกสร้างขึ้นใหม่
  // สร้างแค่ครั้งเดียวเท่านั้น
  // เพราะกฎของ react มันจะสร้างใหม่เมื่อ component โดน re-execute
  // พอโดนสร้างใหม่แม้จะชื่อเดียวกัน js มันมองว่าเป็นคนละตัวกัน
  // เป็นสาเหตุให้เราต้องใช้ useCallBack เมื่อเรา ใช้ useEffect แล้ว depedency เป็น function
  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setModalIsOpen(false);

    const storedIds = JSON.parse(
      localStorage.getItem('selectedPlaces')
    ) || [];
    localStorage.setItem('selectedPlaces', JSON.stringify(storedIds.filter((id)=>id !== selectedPlace.current)))
  }, []);
  

  return (
    <>
      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={'Select the places you would like to visit below.'}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availabelPlaces}
          fallbackText="ระบบกำลังเรียงลำดับสถานที่จากระยะทาง..."
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
