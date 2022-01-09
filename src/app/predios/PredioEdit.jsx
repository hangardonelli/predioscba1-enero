import React, { useState, useContext, useEffect, useRef, Component  } from 'react';
import { Form } from 'react-bootstrap';
import TreeMenu,  { defaultChildren, ItemComponent } from 'react-simple-tree-menu';
import '../../../node_modules/react-simple-tree-menu/dist/main.css';

import api from '../api';
import { DataContext } from '../context';
import { useHistory, useParams } from 'react-router-dom';
import ImageUploader from "react-images-upload";

import listPreferences from '../../data/preferences';
import localities from '../../data/localities';
import FormCourts from './FormCourts';
import UploadImage from '../components/UploadImage';
import Cancha from '../components/Cancha';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'
import PropagateLoader from "react-spinners/PropagateLoader";
import {
  FacebookShareButton,
  WhatsappShareButton,
  FacebookIcon,
  WhatsappIcon,
} from "react-share";

const PredioEdit = () => {
  const { user, setUser } = useContext(DataContext);
  const params = useParams();


  const hiddenLogoInput = useRef(null);
  const history = useHistory();
  const [id, setId] = useState(null);
  const [idPredio, setIdPredio] = useState(null);
  

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [locality, setLocality] = useState('capital');
  const [status, setStatus] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedLogoName, setSelectedLogoName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [preferences, setPreferences] = useState([]);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [courts, setCourts] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
/*
  let a = [
    {
      id: '1',
      label: '11 vs 11',
      price: 1500,
      status: true,
      locality: 'capital',
      typeCourt: 'sintetico',
      idPredio: '1',
      parentId: '0',
      level: '1',
      nodes: null,
      status: true,
      index: 0,
    },
    {
      
      id: "1_1",
      label: '7 vs 7',
      price: 500,
      status: true,
      locality: 'capital',
      typeCourt: 'sintetico',
      idPredio:'1',
      parentId: '1',
      level: "2",
      status: true,
      nodes: null,
      index: 0
    },
    {
      
      id: "1_2",
      label: '5 vs 5',
      price: 400,
      status: true,
      locality: 'capital',
      typeCourt: 'sintetico',
      idPredio: '1',
      index: 1,
      parentId: '1',
      level: "2",
      nodes: null,
      status: false
    }
  ];
  */
  const [canchasArray, setCanchasArray]  = useState(null);
 


  useEffect(() => {
    if(!user) {
      history.push('/auth/login');
    }
  }, [user]);

  function obtenerCanchas(divisions, canchasObtenidas){

    if(canchasObtenidas == null){
        canchasObtenidas = [];
    }

    ;
   for(let i = 0; i < divisions.length; i++){
    if(divisions[i].divisions){
      canchasObtenidas.push(divisions[i]);
        canchasObtenidas = canchasObtenidas.concat(obtenerCanchas(divisions[i].divisions, canchasObtenidas));
    }
    else{
        canchasObtenidas = canchasObtenidas.concat(divisions);
    }
   }


   return canchasObtenidas;
}
   
  useEffect( () => {
 
    if (user.role === 'admin') {
      fetchPredio();
    } else {
      fetchPredio(user.predio);
    }
  }, [])

  const fetchPredio = async (predio = false) => {
 
    const response = await api.predio.getPredio(user.predio._id, {headers: user.headers});
    if (response) {
      const data = response.data;
      console.log(data.divisions);
    let cedi = [...new Set(obtenerCanchas(data.divisions, null))];

    let canchasPredio = [];
    for(let i = 0; i < cedi.length; i++){
      let parts = cedi[i].id.split('_');
      let lastPart = parts[parts.length - 1];
      
      let parentList = parts;
      parentList.pop();
      let parentStr = parentList.join('_');
    
      console.log(cedi[i].id.split('_').length)
      cedi[i].parentId = cedi[i].id.split('_').length > 1 ? parentStr : '0';
      cedi[i].index = parseInt(lastPart) - 1;
      cedi[i].nodes = null;
      cedi[i].level = '' + cedi[i].id.split('_').length;
      console.log(cedi[i]);

      canchasPredio.push(cedi[i]);
    }
    
   


   console.log(canchasPredio);
   if(canchasPredio != null){

    setCanchasArray(canchasPredio);
    setCanchas(canchasPredio);
    setTreeData(list_to_tree(canchasPredio));
     }
     
      console.log(canchasArray);
      console.log(data);
      setId(data._id);
      setIdPredio(data.id);
      setName(data.name);
      setAddress(data.address);
      setPhone(data.phone);
      setEmail(data.email);
      setLocality(data.locality);
      setSelectedLogo(data.logo);
      setSelectedImage(data.image);
      setPreferences(data.preferences);
      setCourts(data.courts)
    }
   
  }

  const handleLogoClick = event => {
    hiddenLogoInput.current.click();
  };

  const onFileChange = (event, type) => {
    const file = event.target.files[0];
    if (type === 'logo') {
      setSelectedLogo(file);
    } else {
      setSelectedImage(file);
    }
  };

   const uploadImage = async (e, folder) => {
     e.preventDefault();
     let item = folder === 'logo' ? selectedLogo : selectedImage;
     let formData = new FormData();

   formData.append('folder', folder); 
     formData.append('file', item); 

     const response = await api.predio.addImage(formData, { headers: {
      'Content-Type': 'multipart/form-data'
    }});
    console.log(response);
   };

  const handlePreferences = (value) => {
    const dataPreferences = [...preferences];
    if (!dataPreferences.includes(value)) {
      dataPreferences.push(value);
    } else {
      dataPreferences.splice(dataPreferences.indexOf(value), 1);
    }

    setPreferences(dataPreferences);
  }

  const handleLocality = (e) => {
    setLocality(e.target.value)
  }

  const generateLocation = async (e) => {
    e.preventDefault();
    const apiKey = 'nR5KopX_r7U3fC1AzejhZeAfWRBkPgu1MlfkzsMPKfM';
    const response = await api.location.get(`${address}, Cordoba`, apiKey);
    if (response.data) {
      const { Location } = response.data.Response.View[0].Result[0];
      setLat(Location.DisplayPosition.Latitude);
      setLng(Location.DisplayPosition.Longitude);
    }
  }

  const save = async (e) => {

    console.log("el logo es");
    console.log(selectedLogo);
    e.preventDefault();
    setLoading(true);
    const dataModel = {
      id,
      name,
      address,
      phone,
      email,
      status,
      locality,
      category: 'futbol',
      preferences: preferences,
      image: 'photo_' + user.predio._id + Math.random()* 122 + '.jpg',
      imageContent: base64Photo,
      logo: 'logo_' + user.predio._id + Math.random()* 122 + '.jpg',
      logoContent: base64Logo,
      lat,
      lng,
      divisions: list_to_divisions(([...new Set(canchasArray)])),
      courts
    };
    console.log(JSON.stringify(dataModel));

    try {
      const response = await api.predio.update(dataModel, {headers: user.headers});
      
      if (response) {
        setUser({...user, predio: response.data});
        setSaved(true);
      }
      setShowMessage('Predio guardado.');
    } catch(err) {
      Swal.fire({
        icon: 'error',
        title: 'Lo sentimos...',
        text: 'Ocurrio un error, por favor revisa los datos cargados.',
      })
      // setShowMessage('Error al guardar predio: ', err);
    }
    setLoading(false);
  };

  const handleAddCourt = (data) => {
    setCourts(prevState => [...prevState, data.court])
  }
  
  const deleteCourt = (e, id) => {
    e.preventDefault();
    setCourts(prevState => prevState.filter(court => court.id !== id))
  }

  const goTo = () => {
    window.location.reload(false);
  }


  const sharePredio = () => {

  }


  function list_to_divisions(list) {
    var map = {}, node, roots = [], i;
  
  for (i = 0; i < list.length; i += 1) {
    map[list[i].id] = i; // initialize the map
    list[i].nodes = []; // initialize the children
    list[i].divisions = []; // initialize the children
    
  }
  
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    if (node.parentId !== "0") {
      // if you have dangling branches check that map[node.parentId] exists

      list[map[node.parentId]].nodes.push(node);
      list[map[node.parentId]].divisions.push(node);
      
      
      
    } else {
      roots.push(node);
      

    }

  }
  return roots
  }


  
  function list_to_tree(list) {
    var map = {}, node, roots = {}, i;
    
    for (i = 0; i < list.length; i += 1) {
      map[list[i].id] = i; // initialize the map
      list[i].nodes = {}; // initialize the children
    }
    
    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parentId !== "0") {
     
  
   
        list[map[node.parentId]].nodes['cancha' + node.id] = node;
        
        
      } else {
        roots['cancha' + node.id] = node;
  
      }
  
    }
    return roots;
  }

  const [canchas, setCanchas] = useState(null);
  const [treeData, setTreeData] = useState(null);


  //#region 
  /*
  {
    '1_1': {               // key
      label: 'Cancha 1 (11 vs 11)',
      price: 1500,
      id: "1",

      index: 0, // decide the rendering order on the same level
      nodes: {
          "cancha1_1":{
            id: "1_1",
              label: 'Cancha 1_1 (7 vs 7)',
              index: 0, 
              nodes:{}
          },
        'second-level-node-2': {
          label: 'Cancha 1_2 (5 vs 5)',
          id: "1_2",
          index: 1,
          nodes: {},
         
        }
      },
    },
  });

*/

  //#endregion
  let canchaActual = {};

   function addCancha(){
   
    let division = {
      id: `${Object.keys(treeData).length + 1}`,
      price: 1500,
      typeCourt: 'sintetico',
      label: '11 vs 11',
      status: true,
      idPredio: idPredio,
      locality: 'capital',
      index: 0,
      parentId: '0',
      level: '1',
      nodes: {},
    }

  
    let canchasArrayEdit = canchasArray;
    canchasArrayEdit.push(division);
    setCanchasArray(canchasArrayEdit);
    setCanchas(list_to_tree(canchasArray));
    console.log("lista");
    setTreeData(list_to_tree(canchasArray));
    console.log(treeData);
    console.log(JSON.stringify(treeData));
   }


   const [picture, setPicture] = useState();
   const[base64Logo, setBase64Logo] = useState();

   const [photo, setPhoto] = useState();
   const[base64Photo, setBase64Photo] = useState();

   function getBase64Photo(file) {
     if(file == null || file == undefined){
       return;
     }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setBase64Photo(reader.result);
      console.log(base64Logo);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }

   function getBase64(file) {
    if(file == null || file == undefined){
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      setBase64Logo(reader.result);
      console.log(base64Logo);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }
   const onDropPhoto = async _picture => {
    try{
     await setPhoto(_picture[0]);
     let read = new FileReader();
     read.readAsBinaryString(_picture[0]);
     read.onloadend = function(){
      setBase64Photo(read.result);
      console.log(read.result);
  }
     console.log(_picture[0]);
     console.log("pausa\n\n\n");
     getBase64Photo(_picture[0]);
}
catch(ex){
  return;
}
   };


   const onDrop = async _picture => {
     try{
     await setPicture(_picture[0]);
     let read = new FileReader();
     read.readAsBinaryString(_picture[0]);
     read.onloadend = function(){
      console.log(read.result);
  }
     console.log(_picture[0]);
     console.log("pausa\n\n\n");
     getBase64(_picture[0]);
}
catch(e){
  return;
}
   };
  function saveCourtChanges(){
    let canchaAEditar = canchaActual;

    canchaAEditar.price =  document.getElementById('canchPrice').value;
    canchaAEditar.label = document.getElementById('canchJugadores').value;
    canchaAEditar.typeCourt = document.getElementById('canchTipo').value;
    canchaAEditar.status = document.getElementById('canchActiva').checked;

    canchaActual = canchaAEditar;
    
    let canchasArrayTemp = canchasArray.filter(c => c.id != canchaActual);
    canchasArrayTemp.push(canchaActual);
 
   
    setCanchasArray(canchasArrayTemp);
    setCanchas(list_to_tree(canchasArray));
    setTreeData(list_to_tree(canchasArray));

    console.log(treeData);
  
  }
  function addDivision(){

    try{
    console.log(canchaActual);
    let division = {
      id: `${canchaActual.id}_${Object.keys(canchaActual.nodes).length + 1}`,
      price: 1502,
      typeCourt: 'sintetico',
      label: '5 vs 5',
      status: true,
      idPredio: idPredio,
      locality: 'capital',
      index: Object.keys(canchaActual.nodes).length,
      parentId: canchaActual.id,
      level: canchaActual.index + 1,
      nodes: {},
      index: Object.keys(canchaActual.nodes).length
    }

  
    let canchasArrayEdit = canchasArray;
    canchasArrayEdit.push(division);
    setCanchasArray(canchasArrayEdit);
    setCanchas(list_to_tree(canchasArray));
 
    setTreeData(list_to_tree(canchasArray));
    console.log(treeData);
    console.log(JSON.stringify(treeData));

  }
  catch(e){
    Swal.fire('Por favor seleccione una cancha');
  }

  }
   function deleteActualCourt(){
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Vas a eliminar esta cancha de " + canchaActual.label + " jugadores y todas sus canchas hijas. Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      
    }).then((result) => {
      if (result.isConfirmed) {
        
        let canchasT = canchasArray.filter(c => !c.id.startsWith(canchaActual.id));
        setCanchasArray(canchasT);
        setCanchas(list_to_tree(canchasT));
       setTreeData(list_to_tree(canchasT));

       console.log(treeData);
 
       
        Swal.fire(
          'Cancha Eliminada',
          'Esta cancha ha sido eliminada correctamente',
          'success'
        )
      }
    })    
  }
  function setCancha(id){
   
     document.getElementById('canchDet').style.visibility = 'visible';
    canchaActual =  canchasArray.find(c => c.id == id);
    console.log(canchaActual);
    
    document.getElementById('canchPrice').value = canchaActual.price;
    document.getElementById('canchJugadores').value = canchaActual.label;
    document.getElementById('canchTipo').value = canchaActual.typeCourt;
    document.getElementById('canchActiva').checked = canchaActual.status ? true : false;
    
    
  }
  
  return (
   
    <div>
      <div className="page-header">
        <h3 className="page-title">Editar Predio</h3>
        
        <div>
          <FacebookShareButton children="facebook"url={`https://fc-cba.com/predios/${user.predio._id}`}>
            <FacebookIcon />
          </FacebookShareButton>
          <WhatsappShareButton children="whatsapp" url={`https://fc-cba.com/predios/${user.predio._id}`}>
            <WhatsappIcon />
          </WhatsappShareButton>
        </div>
      </div>
      {saved ? (
        <div className="row proBanner">
          <div className="col-12">
            <span className="d-flex align-items-center purchase-popup">
              <p>Predio agregado correctamente.</p>
              <button className="ml-auto btn purchase-button" onClick={() => goTo()}>Editar</button>
            </span>
          </div>
        </div>
      ) : (
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <form className="form-sample">
                <div className="row">
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Nombre</label>
                      <div className="col-sm-9">
                        <Form.Control 
                          type="text" 
                          id="name" 
                          placeholder="Nombre" 
                          size="lg"
                          value={name}
                          onChange={(e) => setName(e.target.value)} 
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Dirección</label>
                      <div className="col-sm-9">
                      <Form.Control 
                        type="text" 
                        id="address" 
                        placeholder="Direccion" 
                        size="lg"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}  />
                           {!lat && !lng && <button type="button" className="btn btn-primary" onClick={generateLocation}>Generar cordenadas</button>}
                      </div>
                    </Form.Group>
                 
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Telefono</label>
                      <div className="col-sm-9">
                        <Form.Control 
                          type="text" 
                          id="phone" 
                          placeholder="Telefono" 
                          size="lg"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}  
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-md-6"> 
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Email</label>
                      <div className="col-sm-9">
                      <Form.Control 
                        type="text" 
                        id="email" 
                        placeholder="Email" 
                        size="lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        />
                      </div>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group>
                      <label>Logo</label>
                      <ImageUploader
                    
                        withIcon={true}
                        singleImage={true}
                        withPreview={true}
                        onChange={onDrop}
                        label={"Solo se aceptan fotos menores a 5mb JPG"}
                        imgExtension={[".jpg"]}
                        maxFileSize={5242880}
                      />
                
                   
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group>
                      <label>Imagen</label>
                      <ImageUploader
                    
                        withIcon={true}
                        singleImage={true}
                        withPreview={true}
                        label={"Solo se aceptan fotos menores a 5mb JPG"}
                        onChange={onDropPhoto}
                        imgExtension={[".jpg"]}
                        maxFileSize={5242880}
                      />
                  
                      {!selectedImage ? (
                        <UploadImage name="logo" placeholder="El logo" handleImage={(data, name) => {
                          setSelectedImage(data);
                          setSelectedImageName(name);
                        }} />
                      ) : null}
                     
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <label className="col-form-label">Preferencias</label>
                    <Form.Group>
                      {listPreferences.map(preference => (
                        <div className="form-check form-check-success">
                          <label className="form-check-label">
                            <input 
                              type="checkbox" 
                              className="form-check-input"
                              checked={preferences.includes(preference.val) ? true : false}
                              onClick={() => handlePreferences(preference.val)}
                            /> {preference.label} 
                            <i className="input-helper"></i>
                          </label>
                        </div>
                      ))}
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <div className="row">
                      <label className="col-form-label">Departamento</label>
                      <Form.Group className="row">
                        <div className="col-sm-9">
                          <select className="form-control" onChange={handleLocality}>
                            {localities.map(localityItem => (
                              <option 
                                value={localityItem.hash} 
                                selected={localityItem.hash === locality ? true : false}
                              >{localityItem.label}</option>
                            ))}
                          </select>
                        </div>
                      </Form.Group>
                    </div>
                  </div>
                </div>
                <div className="row form-group">
                  <div className="col-md-12">
                 <div  id="treeMen">
                   
                 <TreeMenu data={treeData}
                  placeholder="Filtrar canchas..."
                  onClickItem={({key, value, id, index, label}) => {
                   setCancha(id); // user defined prop
                  }}
                  >
                    {({ search, items, resetOpenNodes }) => (
                      <div>
                        <button onClick={resetOpenNodes} />
                      {defaultChildren({search, items})}
                      </div>
                    )}
                    </TreeMenu>       
                   </div>     
                    <div style={{visibility: 'hidden'}} id="canchDet" class="CanchaDetail">
                      <h2> Cancha seleccionada:<a id="canchName"></a> </h2> 
                      <h4>Jugadores: <select id="canchJugadores">
                        <option value="5 vs 5">5 vs 5</option>
                        <option value="6 vs 6">6 vs 6</option>
                        <option value="7 vs 7">7 vs 7</option>
                        <option value="8 vs 8">8 vs 8</option>
                        <option value="9 vs 9">9 vs 9</option>
                        <option value="11 vs 11">11 vs 11</option>
                        </select> </h4>
                      <h4>Activa: <input type="checkbox" id="canchActiva"></input></h4>
                      <h4>Precio:<input type="number" id="canchPrice"></input>
                      </h4>
                      <h4>Tipo de pasto: <select id="canchTipo">
                      <option value="sintetico">sintetico</option>
                        <option value="natural">natural</option>
                        </select></h4>
                      
                      <button  style={{marginRight:'20px'}}
                        
                        type="button"
                        onClick={saveCourtChanges} 
                        className="btn btn-success btn-sm"
                        >OK</button>
                          <button  style={{marginRight:'20px'}}
                        
                        type="button" onClick={addDivision}
                        className="btn btn-success btn-sm"
                        >Agregar división</button>
                        
                       
                      <button onClick={deleteActualCourt}
                        type="button" 
                        className="btn btn-danger btn-sm"
                        >Eliminar</button>
                        
                    </div>
             
                   
                  <div className="col-md-12">
                
                  <button  style={{marginRight:'20px', marginTop: '20px'}}
                     
                        type="button" onClick={addCancha}
                        className="btn btn-success btn-sm"
                        >Agregar cancha</button>
                  </div>
                  </div> 
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <button type="button" className="btn btn-primary" onClick={(e) => save(e)}>Guardar</button>
                  </div>
                  <div className="col-md-3">
                    <PropagateLoader
                      size={15}
                      color={"#46c35f"}
                      loading={loading}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}  
      {showMessage && (
        <div><p>{showMessage}</p></div>
      )}
    </div>
  )
}

export default PredioEdit
