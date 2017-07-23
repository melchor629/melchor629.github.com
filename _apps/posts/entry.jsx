import React from 'react';

const translateDay = (day) => {
    let dia = day
    switch(day) {
        case 'Mon': dia = 'Lun'
        case 'Tue': dia = 'Mar'
        case 'Wed': dia = 'Mié'
        case 'Thu': dia = 'Jue'
        case 'Fri': dia = 'Vié'
        case 'Sat': dia = 'Sáb'
        case 'Sun': dia = 'Dom'
    }
    return dia;
};

const translateMonth = (month) => {
    let mes = month
    switch(month) {
        case 'Jan': mes = 'Ene'
        case 'Apr': mes = 'Abr'
        case 'Aug': mes = 'Ago'
        case 'Dec': mes = 'Dic'
    }
    return mes;
}

class Entry extends React.Component {
    render() {
        let fechaPartes = /^(\w{3}), \d\d (\w{3}).+$/i.exec(this.props.entry.fecha)
        let dia = translateDay(fechaPartes[1])
        let mes = translateMonth(fechaPartes[2])
        let fecha = this.props.entry.fecha.replace(fechaPartes[1], dia).replace(fechaPartes[2], mes)
        return (
            <div className="post_entry row">
                <div className="inner-outer">
                    <div className="post_thumb" style={{backgroundImage: `url(${this.props.entry.img})`}}>
                        <a href={'#'+this.props.entry.url} className="post_url">
                            <div className="cover"></div>
                        </a>
                    </div>
                    <h3 className="text-center post_title">
                        <a href={'#'+this.props.entry.url} className="post_url">{this.props.entry.titulo}</a>
                    </h3>
                    <div className="post_info">
                        <small><p className="text-right post_created_time">{fecha}</p></small>
                    </div>
                </div>
            </div>
        );
    }
}

export default Entry;