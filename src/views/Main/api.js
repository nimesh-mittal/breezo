import axios from 'axios';

var API_BASE_URL = "http://localhost:3010"
//var API_BASE_URL = "http://localhost:8810"

export const listServices = (callback, tenant) => {
   var heads = {
     'Accept': 'application/json',
     'Content-Type': 'application/json',
     'Access-control-Allow-Origin': '*'
   }
   axios.get(API_BASE_URL+'/services?tenant='+tenant+'&limit='+100, {headers: heads}).then(callback);
 };

  export const createService = (data, callback, tenant) => {
    var heads = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Access-control-Allow-Origin': '*'
    }
    axios.post(API_BASE_URL+'/services?tenant='+tenant, data, {headers: heads}).then(callback);
  };

  export const deleteService = (service_id, callback, tenant) => {
      var heads = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-control-Allow-Origin': '*'
      }
      axios.delete(API_BASE_URL+'/services/'+service_id+"?tenant="+tenant, {headers: heads}).then(callback);
    };

    export const addProperty = (service_id, data, callback, tenant) => {
      var heads = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-control-Allow-Origin': '*'
      }
      axios.post(API_BASE_URL+'/services/'+service_id+'/properties?tenant='+tenant, data, {headers: heads}).then(callback);
    };

    export const deleteProperty = (service_id, field_id, callback, tenant) => {
        var heads = {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-control-Allow-Origin': '*'
        }
        axios.delete(API_BASE_URL+'/services/'+service_id+"/properties/"+field_id+"?tenant="+tenant, {headers: heads}).then(callback);
      };

      export const editProperty = (service_id, field_id, data, callback, tenant) => {
          var heads = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Access-control-Allow-Origin': '*'
          }
          data.user_id = "todo";
          data.user_name = "todo";
          delete data.field_id
          axios.put(API_BASE_URL+'/services/'+service_id+"/properties/"+field_id+"?tenant="+tenant, data, {headers: heads}).then(callback);
        };

        export const listProperties = (service_id, callback, keyword="", tenant) => {
           var heads = {
             'Accept': 'application/json',
             'Content-Type': 'application/json',
             'Access-control-Allow-Origin': '*'
           }
           axios.get(API_BASE_URL+'/services/'+service_id+'/properties?limit='+500+"&keyword="+keyword+"&tenant="+tenant, {headers: heads}).then(callback);
         };
