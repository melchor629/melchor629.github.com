import React from 'react';

const translateDay = (day) => {
    let dia = day;
    switch(day) {
    case 'Mon': dia = 'Lun'; break;
    case 'Tue': dia = 'Mar'; break;
    case 'Wed': dia = 'Mié'; break;
    case 'Thu': dia = 'Jue'; break;
    case 'Fri': dia = 'Vié'; break;
    case 'Sat': dia = 'Sáb'; break;
    case 'Sun': dia = 'Dom';
    }
    return dia;
};

const translateMonth = (month) => {
    let mes = month;
    switch(month) {
    case 'Jan': mes = 'Ene'; break;
    case 'Apr': mes = 'Abr'; break;
    case 'Aug': mes = 'Ago'; break;
    case 'Dec': mes = 'Dic';
    }
    return mes;
};

class Entry extends React.Component {
    render() {
        let fechaPartes = /^(\w{3}), \d\d (\w{3}).+$/i.exec(this.props.entry.fecha);
        let dia = translateDay(fechaPartes[1]);
        let mes = translateMonth(fechaPartes[2]);
        let fecha = this.props.entry.fecha.replace(fechaPartes[1], dia).replace(fechaPartes[2], mes);
        return (
            <div className="card mb-sm-4 mb-2">
                <div className="card-img-top post_thumb" style={{backgroundImage: `url(${this.props.entry.img})`}}>
                    <a href={'#'+this.props.entry.url} className="post_url">
                        <div className="cover"></div>
                    </a>
                </div>
                <div className="card-body">
                    <h4 className="card-title">
                        <a href={'#'+this.props.entry.url} className="text-white">{this.props.entry.titulo}</a>
                    </h4>
                    <p className="card-text"><small className="text-light">{fecha}</small></p>
                </div>
            </div>
        );
    }
}

export default Entry;