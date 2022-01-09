import React, { useState, useEffect, useContext } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import api from '../api';
import { DataContext } from '../context';

const Ads = () => {
  const history = useHistory();
  const { user } = useContext(DataContext);
  const [listAds, setListAds] = useState([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    const response = await api.ad.getList({headers: user.headers});

    if (response) {
      setListAds(response.data);
    }
  }

  const goToEditAd = (e, id) => {
    e.preventDefault();
    history.push(`/ad/${id}/edit`);
  }

  return (
    <div>
      <div className="row">
        <div className="col-lg-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Publicidades</h4>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th></th>
                      <th> Nombre </th>
                      <th> Categoria </th>
                      <th> Status </th>
                      <th> </th>
                    </tr>
                  </thead>
                  <tbody>
                    {listAds.map((adItem, p) => (
                      <tr key={p} onClick={(e) => goToEditAd(e, adItem._id)}>
                        <td className="font-weight-medium">{p + 1}</td>
                        <td> {adItem.name} </td>
                        <td> {adItem.category} </td>
                        <td>
                          {adItem.status ? "Habilitada" : "Desabilitada"}
                        </td>
                        <td><img src={`${api.baseS3}/ads/${adItem.image}`} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}

export default Ads;