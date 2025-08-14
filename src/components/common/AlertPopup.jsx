import "./AlertPopup.css";

export default function AlertPopup({ show, message, type = "info", onClose }) {
  if (!show) return null;

  const typeConfig = {
    success: {
      icon: <i className="fa fa-times greencross"></i>,
      icon1: <i className="start-icon far fa-check-circle faa-tada animated"></i>,
      strong: "¡Bien hecho!",
    },
    info: {
      icon: <i className="fa fa-times blue-cross"></i>,
      icon1: <i class="start-icon  fa fa-info-circle faa-shake animated"></i>,
      strong: "¡Atención!",
    },
    warning: {
      icon: <i className="fa fa-times warning"></i>,
      icon1: <i class="start-icon fa fa-exclamation-triangle faa-flash animated"></i>,
      strong: "¡Advertencia!",
    },
    danger: {
      icon: <i className="fa fa-times danger "></i>,
      icon1: <i class="start-icon far fa-times-circle faa-pulse animated"></i>,
      strong: "¡Error!",
    },
    primary: {
      icon: <i className="fa fa-times alertprimary"></i>,
      icon1: <i class="start-icon fa fa-thumbs-up faa-bounce animated"></i>,
      strong: "¡Genial!",
    }
  };

  const current = typeConfig[type] || typeConfig.info;

  return (
    <div className="section-alert">
      <div className="square_box box_three"></div>
      <div className="square_box box_four"></div>
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-12">
            <div className={`alert fade alert-simple alert-${type} alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show`}>
              <button type="button" className="close font__size-18" data-dismiss="alert" onClick={onClose}>
                <span aria-hidden="true"><a>
                  {current.icon}
                </a></span>
                <span className="sr-only">Close</span>
              </button>
              {current.icon1}
              <strong className="font__weight-semibold">{current.strong}</strong> {message}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

