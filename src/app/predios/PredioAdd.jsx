import React, { useState, useContext, useEffect } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import api from '../api';
import { DataContext } from '../context';
import { useHistory } from 'react-router-dom';
import listPreferences from '../../data/preferences';
import localities from '../../data/localities';
import FormCourts from './FormCourts';
import UploadImage from '../components/UploadImage';
import PropagateLoader from "react-spinners/PropagateLoader";

const PredioAdd = () => {
  const { user } = useContext(DataContext);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mpPublicKey, setMpPublicKey] = useState(null);
  const [mpAccessToken, setMpAccessToken] = useState(null);
  const [locality, setLocality] = useState('capital');
  const [province, setProvince] = useState('cordoba');
  const [preferences, setPreferences] = useState([]);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [status, setStatus] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [selectedLogoName, setSelectedLogoName] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [courts, setCourts] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(false);
  const [terms, setTerms] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (lat && lng) {
      save();
    }
  }, [lat, lng])

  const handlePreferences = (value) => {
    const dataPreferences = [...preferences];
    if (!dataPreferences.includes(value)) {
      dataPreferences.push(value);
    } else {
      dataPreferences.splice(dataPreferences.indexOf(value), 1);
    }

    setPreferences(dataPreferences);
  };

  const handleLocality = (e) => {
    setLocality(e.target.value)
  };

  const generateLocation = async () => {
    setLoading(true);
    const apiKey = 'nR5KopX_r7U3fC1AzejhZeAfWRBkPgu1MlfkzsMPKfM';
    const response = await api.location.get(`${address}, ${province}`, apiKey);
    if (response.data) {
      if (response.data.Response.View.length) {
        const { Location } = response.data.Response.View[0].Result[0];
        setLat(Location.DisplayPosition.Latitude);
        setLng(Location.DisplayPosition.Longitude);
      }
    }


  };

  const save = async () => {
    // Upload Logo.
    if (selectedLogo) {
      await api.predio.addImage(selectedLogo, { headers: {
        'Content-Type': 'multipart/form-data'
      }});
    }

    // Upload image
    if (selectedImage) {
      await api.predio.addImage(selectedImage, { headers: {
        'Content-Type': 'multipart/form-data'
      }});
    }

    const dataModel = {
      name,
      address,
      phone,
      email,
      password,
      new: true,
      status,
      locality,
      category: 'futbol',
      preferences,
      lat,
      lng,
      image: selectedImageName,
      logo: selectedLogoName,
      courts,
      mpPublicKey,
      mpAccessToken,
      province
    };
    console.log("se agregó?");
    try {
      await api.predio.add(dataModel, {headers: {'Content-Type': 'application/json'}});
      console.log("pude");
      if (user) {
        setMessage('El predio se agrego correctamente.');
      } else {
        setMessage('Se agregó su predio, en breve confirmaremos su cuenta via email.');
      }
      setSaved(true);
    } catch(err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleAddCourt = (data) => {
    setCourts(prevState => [
      ...prevState, 
      data.court
    ])
  }
  
  const deleteCourt = (e, id) => {
    e.preventDefault();
    setCourts(prevState => prevState.filter(court => court.id !== id))
  }

  // Show Modal of Terms and conditons.
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div>
      {saved ? (
        <div className="row proBanner">
          <div className="col-12">
            <span className="d-flex align-items-center purchase-popup">
              <p>{message} Ingresa para agregar sus turnos haciendo <a href="/auth/login">click aqui!</a> </p>
              {/* <button className="ml-auto btn purchase-button" onClick={() => history.push('/')}>Agregar otro</button> */}
            </span>
          </div>
        </div>
      ) : (
        <div className={user ? 'col-12 grid-margin' : 'col-9 align-items-center mx-auto'}>
          <div className="card">
            <div className="card-header">
              <h3 className="page-title">Agregar Predio</h3>
            </div>
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
                          onChange={(e) => setName(e.target.value)} 
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <UploadImage name="logo" placeholder="El logo" handleImage={(data, name) => {
                      setSelectedLogo(data);
                      setSelectedLogoName(name);
                    }} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Calle y nro:</label>
                      <div className="col-sm-9">
                        <Form.Control 
                          type="text" 
                          id="address" 
                          placeholder="Direccion" 
                          size="lg" 
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </div>
                    </Form.Group>
                    {/* {!lat && !lng && <button type="button" className="btn btn-primary" onClick={generateLocation}>Generar cordenadas</button>} */}
                  </div>
                  <div className="col-md-6">
                    <UploadImage name="image" placeholder="La imagen" handleImage={(data, name) => {
                      setSelectedImage(data);
                      setSelectedImageName(name);
                    }} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <Form.Group className="row">
                      <div className="col-sm-9">
                      <Form.Control 
                        type="text" 
                        id="phone" 
                        placeholder="Telefono" 
                        size="lg" 
                        onChange={(e) => setPhone(e.target.value)}  
                      />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-md-4">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Email</label>
                      <div className="col-sm-9">
                      <Form.Control 
                        type="text" 
                        id="email" 
                        placeholder="Email" 
                        size="lg"
                        onChange={(e) => setEmail(e.target.value)} 
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-md-5">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Contraseña</label>
                      <div className="col-sm-9">
                      <Form.Control 
                        type="password" 
                        id="password" 
                        placeholder="Contraseña" 
                        size="lg"
                        onChange={(e) => setPassword(e.target.value)} 
                        />
                      </div>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">MercadoPago Public Key</label>
                      <div className="col-sm-9">
                      <Form.Control 
                        type="text" 
                        id="mp-public-key" 
                        size="lg" 
                        onChange={(e) => setMpPublicKey(e.target.value)}  
                      />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">MercadoPago AccessToken</label>
                      <div className="col-sm-9">
                      <Form.Control 
                        type="text" 
                        id="mp-access-token" 
                        size="lg"
                        onChange={(e) => setMpAccessToken(e.target.value)} 
                        />
                      </div>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 predio-add">
                    <label className="col-form-label">Preferencias</label>
                    <Form.Group>
                      {listPreferences.map((preference, pKey) => (
                        <div key={pKey} className="form-check-success flex">
                          <label className="form-check-label" htmlFor={preference.val}>{preference.label}</label>
                          <input 
                            type="checkbox"
                            id={preference.val}
                            className="form-check-input"
                            checked={preferences.includes(preference.val) ? true : false}
                            onChange={() => handlePreferences(preference.val)}
                          />
                        </div>
                      ))}
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <label className="col-form-label">Departamento/Localidad</label>
                    <Form.Group>
                      <div className="col-sm-9">
                        <select className="form-control" onChange={handleLocality}>
                          {localities.map((localityItem, LKey) => (
                            <option
                              key={LKey}
                              value={localityItem.hash} 
                              selected={localityItem.hash === locality ? true : false}
                            >{localityItem.label}</option>
                          ))}
                        </select>
                      </div>
                    </Form.Group>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input 
                          type="checkbox" 
                          className="form-check-input"
                          checked={terms}
                          onClick={handleShow}
                        />
                        <i className="input-helper"></i>
                        Al registrarte, aceptás nuestros Términos de servicio y Política de privacidad
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-3">
                    <button 
                      disabled={name && address && phone && email && password && locality && courts && terms ? false : true}
                      type="button" 
                      className="btn btn-primary" 
                      onClick={() => generateLocation()}>Guardar</button>
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
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Terminos y Condiciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Los presentes “Términos y Condiciones Generales”, regulan los derechos y obligaciones de todos
los usuarios (conforme se los define más adelante), en el marco de la utilización de la Aplicación.
FUTBOL CLUB APP (en adelante, “F.C. App ”), es propiedad y marca registrada ante el INPI
(Instituto Nacional de Propiedad Industrial) del Sr. Santiago Manuel Amaya Masilla, CUIT 20-
37616433-1, con domicilio legal constituido en la calle Manzana 13 Lote 5 Casa 2 Barrio J.B.
Justo, de la Ciudad de Córdoba, Provincia de Córdoba, República Argentina.
La Aplicación se encuentra dirigida y limitada en cuanto a su utilización exclusivamente a
residentes en la República Argentina. Los Usuarios se encontrarán sujetos a estos Términos y
Condiciones Generales, junto con todas las demás políticas y principios que rigen a F.C App. que
son incorporados al presente por referencia.</p>
          <h4>CUALQUIER PERSONA QUE NO ACEPTE ESTOS TÉRMINOS Y CONDICIONES
GENERALES, LOS CUALES SON CARÁCTER OBLIGATORIO Y VINCULANTE,
DEBERÁ ABSTENERSE DE UTILIZAR LA APLICACIÓN</h4>
          <p>Como condición previa y esencial para la utilización de la Aplicación, el Usuario debe leer,
entender y aceptar todas las condiciones establecidas en los Términos y Condiciones Generales y
en las Políticas de Privacidad.</p>
<p>A través del sitio web y/o plataforma virtual para dispositivos móviles (en adelante, la
“Aplicación”), F.C. App. facilita la vinculación entre prestadores de servicio de alquiler de
predios deportivos (en adelante “Usuarios Administradores”) y personas humanas que requieren
del servicio (en adelante, los “Usuarios”). El servicio prestado por la aplicación es el de un mero
facilitador entre los distintos usuarios. La Aplicación únicamente constituye un mecanismo de
comunicación entre los usuarios. Asimismo, Ud. reconoce que F.C no presta servicios de alquiler
de predios. Bajo ninguna circunstancia los usuarios administradores serán considerados
empleados de F.C ni de ninguno de sus afiliados. Los usuarios administradores prestan el Servicio
de por cuenta y riesgo propios y liberan a F.C de cualquier responsabilidad que pudiera surgir
durante la prestación del mismo. </p>
          <h4>CLAUSULA PRIMERA: El Registro</h4>
          <p>1.1 Usuarios. Categorías. La Aplicación contempla dos categorías de usuarios, estos son: (i)
Usuario Administrador: Son los prestadores de servicio de alquiler de predios deportivos, que a
título personal y bajo su responsabilidad, utilizan la plataforma de F.C. App. con la única finalidad
de facilitar la comunicación con sus clientes, que eventualmente pueden ser Usuarios de F.C. App.
Para ser Usuario Administrador, es necesario contactarse vía email al correo electrónico 
info.fc@gmail.com, y seguir los pasos indicados por esa vía. El Usuario Administrador asume
toda la responsabilidad por los servicios de alquiler de predios deportivos y reconoce que utiliza
la aplicación como un simple medio facilitador. El Usuario Administrador exonera a F.C. App.
de cualquier tipo de responsabilidad por los datos incorporados por este a la Aplicación, daños y
lesiones ocurridas en el predio deportivo, problemas en la reserva de turnos, y/o cualquier otra
situación que pudiera generar responsabilidad civil. F.C. App. no se responsabiliza sobre el
cumplimiento de los Usuarios Administradores en cuanto a habilitaciones municipales,
cumplimiento de normas locales, fiscales, cobertura médica obligatoria, y demás obligaciones
legales propias de la explotación comercial realizada por estos. (ii) Usuarios (a secas): Son las
personas humanas que requieren el servicio brindado por los Usuarios Administradores, esto es
el alquiler de predios deportivos, que utilizan la aplicación solo a los fines de facilitar su
comunicación. </p>
<p>1.2. El acceso a la Aplicación es gratuito para el Usuario, salvo en lo relativo al costo de la
conexión a través de la red de telecomunicaciones suministrada por el proveedor de acceso
contratado (ISP) por el Usuario, que estará a su exclusivo cargo. El Usuario únicamente podrá
acceder a la Aplicación a través de los medios autorizados.</p>
<p>1.3. Podrán ser Usuarios/Usuarios Administradores las personas humanas y jurídicas, mayores de
edad y con capacidad para contratar, en la medida en que realicen el proceso de Registro, y el
mismo sea aceptado por F.C App. A tales efectos, Usted afirma que o es mayor de 18 años, o un
menor emancipado o que posee permiso legal de sus padres y/o tutor y que está completamente
habilitado y competente para entrar en estos términos, condiciones, obligaciones, afirmaciones,
representaciones, y garantías establecidas en estos Términos y Condiciones Generales, y para
respetar y cumplir con estos Términos y Condiciones Generales. Para acceder y utilizar la
Aplicación, el Usuario deberá contar con un Smartphone con sistema operativo IOS o Android y
completar todos los campos del formulario de inscripción correspondiente a los Usuarios con
datos válidos. Quien aspire a convertirse en Usuario deberá verificar que la información que pone
a disposición de F.C sea exacta, precisa y verdadera (en adelante, los “Datos Personales”).
Asimismo, el Usuario asumirá el compromiso de actualizar los Datos Personales cada vez que los
mismos sufran modificaciones. F.C. App. podrá utilizar diversos medios para identificar a los
Usuarios, pero no garantiza a los Usuarios la certeza de los Datos Personales que el resto de los
Usuarios pongan a su disposición. Los Usuarios garantizan y responden, en cualquier caso, por la
veracidad, exactitud, vigencia y autenticidad de los Datos Personales puestos a disposición de
F.C. App. Esto no obsta a la obligación de F.C. App. de rectificar, actualizar o suprimir los datos
incorrectos y demás obligaciones dispuestas en la Ley N° 25.326 y en sus Políticas de Privacidad. </p>
<p>1.4. A los efectos de adquirir la condición de Usuario de F.C. App., se deberá completar en todos
sus campos el formulario de registro correspondiente, así como aceptar las Políticas de Privacidad
y los presentes Términos y Condiciones Generales (en adelante, el “Registro”). </p>
<p>1.5. Una vez efectuado el Registro ya sea como Usuario o Usuario Administrador, F.C App.
otorgará al Usuario una cuenta personal para acceder con la contraseña que elija (en adelante, la
“Cuenta”). El Usuario/Usuario Administrador se obliga a mantener la confidencialidad de su
contraseña. El Usuario será responsable por todas las operaciones efectuadas a través de su
Cuenta, pues el acceso a la misma está restringido al ingreso y uso de su contraseña, de 
conocimiento exclusivo del Usuario. El Usuario/Usuario Administrador se compromete a
notificar a F.C App. en forma inmediata cualquier sospecha, certeza o temor de un acceso no
autorizado a su Cuenta, así como del conocimiento por terceros de su contraseña. A tal efecto, el
Usuario deberá ingresar a su perfil dentro de la Aplicación, o enviar un e-mail a
info.fc@gmail.com desde la casilla de mail que figura en su Cuenta.</p>
<p>1.6. En el caso de que un Usuario/Usuario Administrador haya olvidado su contraseña o quiera
cambiarla, podrá reemplazarla ingresando a su perfil dentro de la Aplicación, o enviando un email a info.fc@gmail.com desde la casilla de mail que figure en su Cuenta. </p>
<p>1.7. La Cuenta es personal, única e intransferible, y está prohibido que un mismo Usuario registre
o posea más de una Cuenta. En caso que F.C. App. detecte distintas Cuentas que contengan datos
coincidentes o relacionados, podrá cancelar, suspender o inhabilitarlas a su entera discreción. </p>
<p>1.8. Los Datos Personales introducidos por el Usuario deberán ser exactos, actuales y veraces en
todo momento. F.C. App. se reserva el derecho de solicitar algún comprobante y/o dato adicional
a efectos de corroborar los Datos Personales, y de suspender temporal y/o definitivamente a aquel
Usuario cuyos datos no hayan podido ser confirmados. F.C App. no garantiza a los
Usuario/Usuario Administrador la certeza de los datos consignados en el Registro por el resto de
los Usuario/Usuario Administrador. El Usuario/Usuario Administrador garantiza y responde, en
cualquier caso, de la veracidad, exactitud, vigencia y autenticidad de sus Datos Personales. Esto
no obsta a la obligación de F.C App. de rectificar, actualizar o suprimir los datos incorrectos y
demás obligaciones dispuestas en la Ley N° 25.326 y en sus Política de Privacidad. Los Datos
Personales que el Usuario proporcione se integrarán en una base de datos personales del que es
responsable F.C. App. Para más información sobre sus datos personales consultar a
info.fc@gmail.com. </p>
<h4>CLAUSULA SEGUNDA: Operatoria de la Aplicación. </h4>
<p>2.1. La Aplicación y su utilización se encuentran limitadas y dirigidas exclusivamente a los
Usuarios y Usuarios administradores.</p>
<p>2.2. El Usuario podrá encontrar en la Aplicación los servicios ofrecidos por los distintos Usuarios
Administradores. El fin de ello es que el Usuario pueda reservar turnos para la utilización de
canchas y/o predios, información brindada por los distintos prestadores. El valor del alquiler
dependerá de la cancha disponible, y se reflejará en el momento de hacer la reserva.</p>
<p>2.3. Los Usuarios aceptan en forma irrevocable que F.C. App. se reserva el derecho de limitar o
bloquear, a su solo arbitrio, a cualquier Usuario/ Usuario Administrador ante cualquier sospecha
de fraude, estafa, uso de datos ajenos, etc., o por cualquier otra sospecha de riesgo, cualquiera
fuese su naturaleza.</p>
<p>2.4. F.C. App. podrá, a su exclusivo criterio, rechazar y/o suspender y/o cancelar cualquier reserva
y/o cuenta realizada por un Usuario a través de la Plataforma siempre y cuando dicho pedido
incumpla o resulte contrario: (i) a cualquier disposición contenida las presentes en los Términos 
y Condiciones Generales o de cualquier ley o regulación aplicable a los mismos (ii) al derecho
aplicable en general y a los derechos de terceros incluyendo, a título meramente enunciativo, otros
Usuarios; y (iii) al uso permitido de la Plataforma.</p>
<h4>CLAUSULA TERCERA: Condiciones Particulares del Uso del Servicio.</h4>
<p>3.1 Una vez seleccionados los Servicios que se deseen utilizar por intermedio de la Aplicación,
será requisito indispensable que el Usuario incorpore los datos exigidos en los campos allí
establecidos y, una vez cumplido ello, se podrá emitir la Reserva correspondiente.</p>
<p>3.2. Efectuada la solicitud y/o reserva de Servicio antedicha, se confirmará la misma.</p>
<h4>CLAUSULA CUARTA: Uso de la Aplicación</h4>
<p>4.1. F.C. App. tendrá las facultades para denegar o restringir el uso de la Aplicación a cualquier
Usuario bajo su exclusivo criterio, sin que dicha denegación o restricción otorguen derecho a
reclamo alguno (cualquiera fuere su naturaleza u objeto) en favor del Usuario. F.C. App. no será
responsable si el Usuario no cuenta con un teléfono celular inteligente compatible con el uso de
la Aplicación. El Usuario se compromete a hacer un uso adecuado y lícito de la Aplicación de
conformidad con la legislación aplicable, los presentes Términos y Condiciones Generales, la
moral y buenas costumbres generalmente aceptadas y el orden público. Al utilizar la Aplicación
el Usuario acuerda que:
(A) Solo utilizará la Aplicación para su uso personal y no podrá disponer de ningún modo de su
Cuenta, así como tampoco ceder ni autorizar su uso por un tercero.
(B) No utilizará la Cuenta de un tercero.
(C) No solicitará la Aplicación con fines ilícitos, ilegales, contrarios a lo establecido en los
presentes Términos y Condiciones Generales, a la buena fe y al orden público, lesivos de los
derechos e intereses de terceros incluyendo, sin limitación, el transporte de material ilegal o con
fines fraudulentos.
(D) No tratará de dañar la Aplicación de ningún modo, ni accederá a recursos restringidos en la
Aplicación. 
(E) Guardará de forma segura y confidencial la contraseña de su Cuenta y cualquier identificación
facilitada para permitirle acceder a la Aplicación.
(F) No utilizará la Aplicación con un dispositivo incompatible o no autorizado.
(G) No intentará acceder, utilizar y/o manipular los datos de F.C App. y de otros Usuarios.
(H) No introducirá ni difundirá introducir o difundir virus informáticos o cualesquiera otros
sistemas físicos o lógicos que sean susceptibles de provocar daños en la Aplicación.</p>
<h4>CLAUSULA QUINTA: Cancelaciones y Penalidades</h4>
<p>5.1. Una vez emitida la Reserva, el Usuario podrá cancelarla (en adelante, “Cancelación”) sin
penalidad alguna siempre que realice la Cancelación del Servicio a través de la Aplicación antes
de las 24 horas de la reserva.</p>
<p>5.2. De no efectuarse la Cancelación en el tiempo estipulado en el punto precedente, el Usuario
estará obligado a abonar el 100% (cien por ciento) del monto correspondiente al pago del servicio
de utilización de chanchas y predios.</p>
<p>5.3. El Usuario en ningún caso podrá alegar falta de conocimiento de las limitaciones,
restricciones y penalidades, dado que las mismas son informadas en forma previa a realizar la
solicitud del Servicio. </p>
<h4>CLAUSULA SEXTA: Responsabilidad</h4>
<p>6.1. F.C. App. sólo pone a disposición al Usuario un espacio virtual que les permite ponerse en
comunicación con los Usuarios Administradores mediante la Aplicación para solicitar Servicios
de alquiler de predios deportivos. F.C. App. no interviene en el perfeccionamiento de las
operaciones realizadas entre el Usuario y el Usuario administrador, por ello no será responsable
respecto de la calidad, cantidad, estado, integridad o legitimidad de la instalaciones, así como de
la capacidad para contratar de los usuarios administradores, ni otorga garantía sobre la veracidad
de sus datos personales por ellos ingresados.</p>
<p>6.2. F.C. APP. NO GARANTIZA, NI SE ADHIERE, NI ASUME RESPONSABILIDAD POR
NINGUN PRODUCTO, O SERVICIO PUBLICITADO U OFRECIDO POR UN TERCERO A
TRAVES DE LA APLICACIÓN O DE OTROS SITIOS ACCEDIDOS A TRAVÉS DE LOS
ENLACES EN LA APLICACIÓN, O QUE APAREZCAN PUBLICITADOS EN CUALQUIER
CARTEL O IMAGEN DENTRO DE LA APLICACIÓN. NI CON LA COMPRA DE UN 
PRODUCTO O SERVICIO A TRAVES DE CUALQUIER MEDIO O EN CUALQUIER
CIRCUNSTANCIA, USTED DEBERIA USAR SU MEJOR CRITERIO Y EJERCITAR
PRECAUCION EN CASO DE SER NECESARIO.</p>
<p>6.3. El Usuario conoce y acepta que, al realizar operaciones con los Usuarios Administradores lo
hace bajo su propio riesgo. En ningún caso F.C. App. será responsable por lucro cesante, o por
cualquier otro daño y/o perjuicio que haya podido sufrir el Usuario, el Usuario Administrador y/o
cualquier otra persona debido a la utilización de la Aplicación.</p>
<p>6.4. F.C App. recomienda actuar con prudencia y sentido común al momento de utilizar la
Aplicación. En caso que uno o más Usuarios o algún tercero inicien cualquier tipo de reclamo o
acciones legales contra un Usuario o Usuario Administrador, todos y cada uno de los involucrados
en dichos reclamos o acciones eximen de toda responsabilidad a F.C App., sus sociedades
vinculadas, socios, empleados, representantes, apoderados y agentes.</p>
<p>6.5. Sitios Enlazados. La Aplicación puede contener enlaces y/o referencias a otras aplicaciones
o sitios web de terceros (en adelante, “Sitios Enlazados”), lo cual no indica que ellos sean
propiedad de F.C. App. u operados por F.C. App. La instalación de estos enlaces o referencias
en la Aplicación se limita a facilitar al Usuario la búsqueda y acceso a la información allí
disponible. En virtud de que F.C. App. no tiene control sobre tales aplicaciones y sitios, no será
responsable por los contenidos, materiales, acciones y/o servicios prestados por los mismos, ni
por daños o pérdidas ocasionadas a los Usuarios, por la utilización de los mismos. La presencia
de enlaces a otras plataformas o sitios web no implica una sociedad, relación, aprobación y/o
respaldo de F.C. App. a dichas plataformas o sitios y sus contenidos. Si Ud. decide dejar la
Aplicación y acceder a Sitios Enlazados, usted entiende que lo hace bajo su propio riesgo. La
conexión que el Usuario realice con otros Sitios Enlazados queda totalmente bajo la
responsabilidad de dicho Usuario. F.C. App. no ha controlado de ninguna manera los Sitios
Enlazados y no se hace responsable por el contenido, exactitud o autenticidad expresados en estos
sitios web. La inclusión de estos enlaces en la Aplicación no implica aprobación o respaldo por
F.C. de los Sitios Enlazados, sus entidades o productos y servicios. El Usuario/Usuario
Administrador acepta que, en caso de incumplimiento o prestación defectuosa por parte del
tercero involucrado, solamente reclamará a dicho tercero, dejando indemne a F.C. App., quien no
será parte de dicha relación.</p>
<p>6.6. EN NINGÚN CASO F.C. APP. SERÁ RESPONSABLE POR DAÑOS Y PERJUICIOS
DIRECTOS, INDIRECTOS, IMPREVISTOS, MEDIATOS O PUNITORIOS (INCLUSO SI
F.C. APP. FUE ADVERTIDO SOBRE DICHOS DAÑOS Y PERJUICIOS), QUE RESULTEN
DE ALGÚN ASPECTO DEL USO QUE EL USUARIO HAGA DE LA APLICACIÓN, YA SEA
QUE LOS DAÑOS Y PERJUICIOS SURJAN A PARTIR DEL USO O EL MAL USO DE LA
APLICACIÓN O EL SERVICIO, ANTE LA INCAPACIDAD DE UTILIZAR LA
APLICACIÓN, O LA INTERRUPCIÓN, SUSPENSIÓN, MODIFICACIÓN, ALTERACIÓN O
CANCELACIÓN DE LA APLICACIÓN. DICHA LIMITACIÓN TAMBIÉN SERÁ
APLICABLE CON RELACIÓN A LOS DAÑOS Y PERJUICIOS EN QUE SE INCURRAN A
RAÍZ DE OTROS SERVICIOS O PRODUCTOS RECIBIDOS A TRAVÉS O CON RELACIÓN
A LA APLICACIÓN O LOS SITIOS ENLAZADOS EN LA APLICACIÓN, ASÍ COMO
TAMBIÉN A CAUSA DE LA INFORMACIÓN O EL CONSEJO RECIBIDO A TRAVÉS DE 
LA APLICACIÓN O PUBLICITADO CON RELACIÓN A ESTOS O UNO DE LOS SITIOS
ENLAZADOS EN LA APLICACIÓN. LAS LIMITACIONES QUE ANTECEDEN SE
APLICARÁN DENTRO DEL MÁXIMO ALCANCE PERMITIDO POR LA LEY.</p>
<h4>CLAUSULA SEPTIMA: Uso y Garantía de la Aplicación </h4>
<p>7.1. F.C. App. no garantiza la disponibilidad y continuidad del funcionamiento de la Aplicación.
En consecuencia, F.C. no será en ningún caso responsable por cualquier daño y/o perjuicio que
puedan derivarse de (i) la falta de disponibilidad o accesibilidad a la Aplicación; (ii) la
interrupción en el funcionamiento de la Aplicación o fallos informáticos, averías telefónicas,
desconexiones, retrasos o bloqueos causados por deficiencias o sobrecargas en las líneas
telefónicas, centros de datos, en el sistema de Internet o en otros sistemas electrónicos, producidos
en el curso de su funcionamiento; y (iii) otros daños que puedan ser causados por terceros
mediante intromisiones no autorizadas ajenas al control de F.C App.</p>
<p>7.2. F.C. App. no garantiza la ausencia de virus ni de otros elementos en la Aplicación
introducidos por terceros ajenos a F.C. que puedan producir alteraciones en los sistemas físicos o
lógicos del Usuario o en los documentos electrónicos y ficheros almacenados en sus sistemas. En
consecuencia, F.C. App. no será en ningún caso responsable de cualesquiera daños y perjuicios
de toda naturaleza que pudieran derivarse de la presencia de virus u otros elementos que puedan
producir alteraciones en los sistemas físicos o lógicos, documentos electrónicos o ficheros del
Usuario.</p>
<p>7.3. F.C. App. adopta diversas medidas de protección para proteger la Aplicación y los contenidos
contra ataques informáticos de terceros. No obstante, F.C. no garantiza que terceros no
autorizados no puedan conocer las condiciones, características y circunstancias en las cuales el
Usuario accede a la Aplicación. En consecuencia, F.C. no será en ningún caso responsable de los
daños y perjuicios que pudieran derivarse de dicho acceso no autorizado.</p>
<p>7.4. F.C. App. no será responsable por el incumplimiento de sus obligaciones si esto deviniere
imposible, restringido o interferido por cualquier período de tiempo por caso fortuito, fuerza
mayor o hechos de terceros. En ningún caso F.C. App. será responsable por lucro cesante, pérdida
de chance, daño indirecto, daño incidental, indemnización de consecuencias no patrimoniales,
daño punitivo, ni por cualquier otro daño y/o perjuicio resarcible que hayan podido sufrir los
Usuarios o cualquier otra persona como consecuencia o en relación con las operaciones realizadas
o no realizadas a través de la Aplicación. </p>
<h4>CLAUSULA OCTAVA: Derechos de Propiedad Intelectual e Industrial </h4>
<p>8.1. El Usuario reconoce y acepta que todos los derechos de propiedad intelectual e industrial
sobre los contenidos y/o cualesquiera otros elementos insertados en la Aplicación (incluyendo,
sin limitación, marcas, logotipos, nombres comerciales, textos, imágenes, gráficos, diseños, 
sonidos, bases de datos, software, diagramas de flujo, presentación, audio y vídeo), pertenecen a
F.C. App. y en consecuencia a su propietario.</p>
<p>8.2. F.C App. autoriza al Usuario/Usuario Administrador a utilizar, visualizar, imprimir,
descargar y almacenar los contenidos y/o los elementos insertados en la Aplicación
exclusivamente para su uso personal, privado y no lucrativo, absteniéndose de realizar sobre los
mismos cualquier acto de descompilación, ingeniería inversa, modificación, divulgación o
suministro. Cualquier otro uso o explotación de cualesquiera contenidos y/u otros elementos
insertados en la Aplicación distinto de los aquí expresamente previstos estará sujeto a la
autorización previa de F.C.</p>
<h4>CLAUSULA NOVENA: Protección de Datos</h4>
<p>9.1. Los Datos Personales que Ud. proporciona en el Registro se integrarán en una base de datos
personales del que es responsable F.C. App., cuya dirección figura en el encabezamiento del
presente documento.</p>
<p>9.2 El Usuario confirma y acepta que presta su consentimiento previo, expreso e informado para
que F.C. pueda tratar sus datos personales en un todo de acuerdo a lo dispuesto en estos Términos
y Condiciones Generales.</p>
<p>9.3 A fin de utilizar la Aplicación, los Titulares de los datos deben registrarse, suministrando
ciertos datos personales completos y exactos. F.C. App. podrá solicitar, recabar y almacenar la
siguiente información personal: apodo o seudónimo (nombre de Titular de los datos) para operar
en el sitio de F.C. App., nombre y apellido, número de documento o identificación válida,
información física de contacto (como número de teléfono, domicilio, dirección de e-mail, etc.).
F.C. App. podrá confirmar la Información Personal suministrada acudiendo a entidades públicas,
compañías especializadas o centrales de riesgo, para lo cual el Titular de los datos mediante el
presente lo autoriza expresamente. La información que F.C. App. obtenga de estas entidades será
tratada en forma confidencial.</p>
<p>9.4. El Titular de los datos que se registre en la Aplicación, consiente expresamente que F.C. App.
tenga acceso, en cualquier momento, a la totalidad de la información contenida en su Cuenta,
incluyendo en particular, pero sin limitación, a su Información Personal, información sobre sus
intereses, gustos, contactos y cualquier otro contenido alojado en su Cuenta. Se deja expresamente
establecido que los datos recabados por F.C. App. en ningún momento excederán el ámbito y la
finalidad para los que se hubieren obtenido, de conformidad con la Ley N° 25.326 (Protección de
Datos Personales). </p>
<h4>CLAUSULA DECIMA: Cancelación o cierre de la Cuenta</h4>
<p>10.1 Cancelación o cierre de la Cuenta por parte del Usuario/Usuario Administrador. Siempre que
no haya operaciones pendientes o en curso, el Usuario/Usuario Administrador puede cerrar su 
Cuenta en cualquier momento. Para hacerlo, debe ingresar a su perfil dentro de la Aplicación, o
enviar un e-mail a info.fc@gmail.com desde la casilla de mail ingresada en su Cuenta
solicitándolo.</p>
<p>10.2 Cancelación o cierre de la Cuenta por parte de F.C. App. F.C. App. se reserva el derecho de
suspender o dar de baja una Cuenta, sin estar obligado a comunicar o exponer las razones de su
decisión y sin que ello genere derecho alguno a indemnización o resarcimiento a favor del
Usuario. F.C. puede suspender o dar de baja una Cuenta ante cualquier incumplimiento o indicio
de incumplimiento a los presentes Términos y Condiciones Generales o a la ley por parte del
Usuario/Usuario Administrador, sin necesidad de intimación previa al cumplimiento, en cualquier
momento y con efectos inmediatos, reservándose el derecho de reclamar los daños y perjuicios
que tal incumplimiento haya causado.</p>
<p>10.3. Ulterior cumplimiento de obligaciones. En los casos indicados en los apartados 10.1. y 10.2.
precedentes, el Usuario seguirá siendo responsable de todas las obligaciones relacionadas con su
Cuenta incluso después del cierre de su Cuenta. </p>
<h4>CLAUSULA DECIMO PRIMERA: Modificaciones de los Términos y Condiciones
Generales</h4>
<p>11.1. F.C. App. podrá modificar los Términos y Condiciones Generales en cualquier momento
haciendo públicos en la Aplicación los Términos y Condiciones Generales modificados. Todos
los términos modificados entrarán en vigor a los 10 (diez) días corridos contados a partir de su
publicación. En caso de desacuerdo respecto de tales modificaciones, el Usuario deberá
comunicar a F.C. App. su NO aceptación, en cuyo caso se procederá a dar de baja su Cuenta y se
considerará finalizado su vínculo con F.C., debiendo dicho Usuario cumplir previamente con
cualquier obligación pendiente con F.C., los usuarios, usuarios administradores o cualquier otro
tercero. Vencido el plazo referido sin expresar su disconformidad con los nuevos Términos y
Condiciones Generales, se considerará que el Usuario acepta los mismos y las partes continuarán
vinculadas según dichos términos.</p>
<h4>CLAUSULA DECIMO SEGUNDA: Notificaciones</h4>
<p>12.1. F.C. podrá realizar las notificaciones al Usuario/Usuario Administrador a través de una
notificación general en la Aplicación, a través de mensajes de texto, y a la dirección de correo
electrónico facilitada por el Usuario en su Cuenta. El Usuario podrá comunicarse con F.C.
mediante el envío de un correo electrónico a la dirección info.FC@gmail.com.</p>
<h4>CLAUSULA DECIMO TERCERA: Cesión</h4>
<p>13.1. El Usuario/Usuario Administrador no podrá ceder sus derechos y obligaciones dimanantes
de los presentes Términos y Condiciones Generales sin el previo consentimiento escrito de F.C.
App. F.C. App. podrá ceder, transferir, delegar o disponer de los derechos u obligaciones
derivados de la presente vinculación (incluyendo su posición contractual), total o parcialmente,
para lo cual, en virtud de su aceptación de los presentes Términos y Condiciones Generales, los
Usuarios otorgan su consentimiento expreso y de manera previa para la realización de dichas
acciones.</p>
<h4>CLAUSULA DECIMO CUARTA: Ley Aplicable y Jurisdicción</h4>
<p>14.1. Las presentes Términos y Condiciones Generales, así como la relación entre F.C. y los
Usuario, se regirán e interpretarán con arreglo a la legislación vigente en la República Argentina.
Cualquier controversia derivada de la utilización de la Aplicación y de los presentes Términos y
Condiciones Generales, su existencia, validez, interpretación, alcance o cumplimiento, será
sometida ante los Tribunales Ordinarios en lo Civil y Comercial de la Ciudad de Córdoba.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => handleClose()}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => {
            setTerms(true);
            setShow(false)
          }}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default PredioAdd;
