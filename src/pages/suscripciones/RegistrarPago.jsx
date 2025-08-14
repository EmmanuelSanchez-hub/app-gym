import { useParams, useNavigate } from "react-router-dom";
import FormPago from "../pagos/FormPago";

export default function RegistrarPago() {
  const { id } = useParams(); // id de la suscripción
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/suscripciones"); // Redirige después de registrar el pago
  };

  return (
    <div className="pagina-registrar-pago">
      <h2>Registrar Pago</h2>
      <FormPago idSuscripcion={id} onClose={handleClose} />
    </div>
  );
}
