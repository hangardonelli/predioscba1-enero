import React from 'react';
import axios from 'axios';

const baseUrl = 'https://api.fc-cba.com';
const baseS3 = 'https://fccbaaads.s3.amazonaws.com'


const auth = {
  login: (dataModel, headers) => axios.post(`${baseUrl}/auth/login`, dataModel, headers),
  register: (dataModel, headers) => axios.post(`${baseUrl}/auth/register`, dataModel, headers)
};

const predio = {
  add: (dataModel, headers) => axios.post(`${baseUrl}/predios/create`, dataModel, headers),
  update: (dataModel, headers) => axios.put(`${baseUrl}/predios/update`, dataModel, headers),
  getAll: (
    headers, 
    locality, 
    services) => axios.get(`${baseUrl}/predios?locality=${locality}&services=${services}`, headers),
  getPredio: (predioId, headers) => axios.get(`${baseUrl}/predios/predio/${predioId}`, headers),
  getList: (headers) => axios.get(`${baseUrl}/predios/list`, headers),
  getListDisable: (headers) => axios.get(`${baseUrl}/predios/list-disable`, headers),
  getTurnos: (headers, id) => axios.get(`${baseUrl}/predios/turnos/${id}/16-06-2020`, headers),
  addImage: (dataModel, headers, folder) => axios.post(`${baseUrl}/upload/predio/add-logo`, dataModel, headers),
  enable: (headers, dataModel) => axios.put(`${baseUrl}/predios/enable`, dataModel, headers)
};

const turno = {
  getList: (headers, id) => axios.get(`${baseUrl}/turnos/${id}/predio`, headers), 
  add: (dataModel, headers) => axios.post(`${baseUrl}/predios/turno/create`, dataModel, headers),
  disable: (headers, dataModel) => axios.put(`${baseUrl}/turnos/${dataModel.id}`, dataModel, headers),
  confirm: (headers, dataModel) => axios.put(`${baseUrl}/turnos/confirm/${dataModel.id}`, dataModel, headers),
  getNotPaidFee: (headers, id) => axios.get(`${baseUrl}/turnos/get-not-fee-paid/${id}`, headers), 
};

const ad = {
  add: (dataModel, headers) => axios.post(`${baseUrl}/ads/create`, dataModel, headers),
  getList: (headers) => axios.get(`${baseUrl}/ads`, headers),
};

const card = {
  saveCard: (dataModel, headers) => axios.post(`${baseUrl}/cards/add`, dataModel, {headers})
};

const pay = {
  add: (dataModel, headers) => axios.post(`${baseUrl}/pay/create`, dataModel, {headers})
};

const location = {
  get: (address, apiKey) => axios.get(`https://geocoder.ls.hereapi.com/6.2/geocode.json?apiKey=${apiKey}&searchtext=${address}`)
};

export default {
  auth,
  predio,
  ad,
  turno,
  card,
  location,
  pay,
  baseS3
}
