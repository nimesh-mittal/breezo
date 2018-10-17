import React, { Component } from 'react';
import { Col, Row, Form, Input, ListGroup, ListGroupItem, Collapse } from 'reactstrap';
import { Badge, Card, CardBody, CardHeader, Pagination, PaginationItem, PaginationLink, Table, Button } from 'reactstrap';
import {listServices, createService, deleteService} from './api';
import {listProperties, addProperty, deleteProperty, editProperty} from './api';
import moment from 'moment'

// Brand Card Chart
class Widgets extends Component {
  constructor(props) {
      super(props);
      this.state = {offset: 0, show_add_properties: false, show_edit_properties: false, show_add_service: false,
                    tenant: '*', ip: '*', name: '', value: '', service_name: '', services: [], properties: [],
                    current_service_id: 'none'
                  };
      this.on_add = this.on_add.bind(this);
      this.on_edit = this.on_edit.bind(this);
      this.on_delete = this.on_delete.bind(this);
      this.on_search = this.on_search.bind(this);
      this.on_service = this.on_service.bind(this);
      this.on_cancel = this.on_cancel.bind(this);
      this.on_service_add = this.on_service_add.bind(this);
      this.on_service_delete = this.on_service_delete.bind(this);
      this.add_service = this.add_service.bind(this);
      this.add_property = this.add_property.bind(this);
      this.edit_property = this.edit_property.bind(this);
      this.update_service_list = this.update_service_list.bind(this);
      this.on_page_click = this.on_page_click.bind(this);
      this.page_size = 10;
      this.update_service_list();
  }

  update_service_list(){
      listServices(res => {this.setState({'services': res.data.data}); this.on_service(this.state.services[0].service_id)}, 'dev');
  }

  on_service(service_id){
    console.log("on service");
    console.log(service_id);
    this.setState({'current_service_id': service_id})
    listProperties(service_id, resp => this.setState({'properties':resp.data.data}), "", 'dev');
  }

  on_service_add(){
    console.log("on service add");
    this.setState({show_add_service: true});
  }

  add_service(){
    console.log("add service");
    const data = {'name': this.state.service_name}
    createService(data, this.update_service_list, 'dev');
  }

  on_service_delete(service_id){
    deleteService(service_id, this.update_service_list, 'dev')
  }

  on_add(){
    console.log("on add");
    this.setState({show_add_properties: true});
  }

  add_property(){
    console.log("add property");
    const service_id = this.state.current_service_id;
    const data = {'tenant': this.state.tenant, 'ip': this.state.ip, 'name': this.state.name, 'value': this.state.value}
    addProperty(service_id, data, resp => {this.on_service(this.state.current_service_id)}, 'dev');
  }

  edit_property(){
    console.log("add property");
    const service_id = this.state.current_service_id;
    const data = {'field_id': this.state.field_id, 'tenant': this.state.tenant, 'ip': this.state.ip, 'name': this.state.name, 'value': this.state.value}
    editProperty(service_id, this.state.field_id, data, resp => {this.on_service(this.state.current_service_id)}, 'dev');
  }

  on_edit(item){
    console.log("on edit");
    console.log(item);
    this.setState({show_edit_properties: true});
    this.setState({field_id:item.field_id, tenant: item.tenant, ip: item.ip, name: item.name, value: item.value})
  }

  on_delete(service_id, field_id){
    console.log("on property delete");
    deleteProperty(service_id, field_id, resp => {this.on_service(this.state.current_service_id)}, 'dev')
  }

  on_search(e){
    console.log("on search");
    console.log(e.target.value);
    listProperties(this.state.current_service_id, resp => this.setState({'properties':resp.data.data}), e.target.value, 'dev');
  }

  on_cancel(e){
    console.log("on cancel");
    this.setState({show_add_properties: false});
    this.setState({show_edit_properties: false});
    this.setState({show_add_service: false});
  }

  on_page_click(page_number){
    console.log(page_number);
    if(page_number > 0){
      this.setState({'offset': (page_number-1)*this.page_size})
    }
  }

  renderList(){
    return ( this.state.services.map((item, index) => {
          return (<ListGroupItem key={index} className="justify-content-between"
                    style={{color: this.state.current_service_id !== item.service_id ? '': '#20a8d8'}}
                    onClick={e => this.on_service(item.service_id)}>{item.name}
                    <i style={{ marginLeft: 10}} className="fa fa-trash-o float-right" onClick={e => this.on_service_delete(item.service_id)}></i>
                    <Badge className="float-right" color="default">{item.count}</Badge>
          </ListGroupItem>)
        }));
  }

  renderProperties(){
    return this.state.properties.slice(this.state.offset, this.state.offset + this.page_size).map((item, index) => {
      return (<tr key={item.field_id}
                  style={{color: this.state.field_id !== item.field_id ? '': '#20a8d8'}}>
                      <td>{item.tenant}</td>
                      <td>{item.ip}</td>
                      <td>{item.name}</td>
                      <td>{item.value}</td>
                      <td>{moment().to(item.updated_at).toString()}</td>
                      <td>
                        <i style={{ marginLeft: 10}} className="fa fa-pencil-square-o fa-lg" onClick={e => this.on_edit(item)}></i>
                        <i style={{ marginLeft: 10}} className="fa fa-trash-o fa-lg" onClick={e => this.on_delete(item.service_id, item.field_id)}></i>
                      </td>
                    </tr>)
    });
  }

  renderAddPropertyForm(){
    return (  <Collapse isOpen={this.state.show_add_properties}>
              <Card>
              <CardHeader>Add Property</CardHeader>
              <CardBody>
                <Form>
                  <Input type="text" id="search" placeholder="Tenant" onChange={e => this.setState({tenant:e.target.value}) } />
                  <Input type="text" id="search" placeholder="IP" onChange={e => this.setState({ip:e.target.value}) } />
                  <Input type="text" id="search" placeholder="Name" onChange={e => this.setState({name:e.target.value}) } />
                  <Input type="text" id="search" placeholder="Value" onChange={e => this.setState({value:e.target.value}) } />
                </Form>
                <Button color="primary" style={{ margin: 10}} onClick={e => this.add_property(e)}>Add Property</Button>
                <Button color="primary" style={{ margin: 10}} onClick={e => this.on_cancel(e)}>Cancel</Button>
              </CardBody></Card></Collapse>)
  }

  renderEditPropertyForm(){
    return (  <Collapse isOpen={this.state.show_edit_properties}><Card><CardHeader>Edit Property</CardHeader><CardBody>
                <Form style={{ marginRight: 5}}>
                  <Input type="text" id="tenant" value={this.state.tenant}
                         placeholder="Tenant" onChange={e => this.setState({tenant:e.target.value}) } />
                  <Input type="text" id="ip" value={this.state.ip}
                         placeholder="IP" onChange={e => this.setState({ip:e.target.value}) } />
                  <Input type="text" id="name" value={this.state.name}
                         placeholder="Name" onChange={e => this.setState({name:e.target.value}) } />
                  <Input type="text" id="value" value={this.state.value}
                         placeholder="Value" onChange={e => this.setState({value:e.target.value}) } />
                </Form>
                <Button color="primary" style={{ margin: 10}} onClick={e => this.edit_property(e)}>Edit Property</Button>
                <Button color="primary" style={{ margin: 10}} onClick={e => this.on_cancel(e)}>Cancel</Button>
              </CardBody></Card></Collapse>)
  }

  renderServiceForm(){
    return (  <Collapse isOpen={this.state.show_add_service}>
                <Card><CardHeader>Create Service</CardHeader><CardBody>
                <Form>
                  <Input type="text" id="name" placeholder="Name" onChange={e => this.setState({service_name: e.target.value}) } />
                  <Button color="primary" style={{ margin: 10}} onClick={e => this.add_service(e)}>Add Service</Button>
                  <Button color="primary" style={{ margin: 10}} onClick={e => this.on_cancel(e)}>Cancel</Button>
                </Form></CardBody></Card></Collapse>)
  }

  renderHeader(){
    return (  <CardHeader>Properties</CardHeader>)
  }

  renderTableHeader(){
    return (    <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>IP Address</th>
                    <th>Field Name</th>
                    <th>Value</th>
                    <th>Modified On</th>
                    <th></th>
                  </tr>
                  </thead>)
  }

  renderPagination(){
    return (<Pagination>
              <PaginationItem onClick={e => this.on_page_click(-1)}>
                <PaginationLink previous tag="button" />
              </PaginationItem>
              {[1,2,3,4,5].map( item => {return (<PaginationItem key={item} active onClick={e => this.on_page_click(item)}>
                              <PaginationLink tag="button">
                                {item}
                              </PaginationLink>
                            </PaginationItem>)})}
              <PaginationItem onClick={e => this.on_page_click(0)}>
                <PaginationLink next tag="button" />
              </PaginationItem>
            </Pagination>)
  }

  render() {
    return (
      <Row>
        <Col sm="3" xl="3">
        {this.renderServiceForm()}
        <Card>
           <CardHeader>
             <strong>Services</strong>
             <div className="card-header-actions">
               <i className="fa fa-plus-square-o fa-lg" onClick={e => this.on_service_add()}></i>
             </div>
           </CardHeader>
           <CardBody>
            <ListGroup style={{'minHeight': 'calc(100vh - 210px)', 'overflowY': 'scroll'}}>
              {this.renderList()}
            </ListGroup>
          </CardBody>
        </Card>
        </Col>
        <Col sm="9" xl="9">
      <div className="animated fadeIn">
        {this.renderAddPropertyForm()}
        {this.renderEditPropertyForm()}
        <Card style={{'minHeight': 'calc(100vh - 120px)', 'overflowY': 'scroll'}}>
            {this.renderHeader()}
          <CardBody style={{margin:5, display: this.state.properties.length > 0 ? '': 'none'}}>
            <Row style={{border:'solid', borderColor:'#ece9e9', borderWidth: 1, padding: 5}}>
              <Col sm="3" xl="3">
                  <Input type="text" id="search" placeholder="search" onChange={e => this.on_search(e)} />
              </Col>
              <Col>
                <i className="fa fa-plus-square-o fa-lg pull-right" style={{margin:10}} onClick={e => this.on_add()}></i>
              </Col>
            </Row>
            <Row style={{margin:10, marginBottom: 20, marginTop: 20}}>
              <Table hover responsive size="sm">
                {this.renderTableHeader()}
                <tbody>
                  {this.renderProperties()}
                </tbody>
              </Table>
            </Row>
            <Row>
              <Col sm="8" xl="8"><h6>{this.state.offset} to {this.state.offset + this.page_size} of {this.state.properties.length}</h6></Col>
              <Col sm="3" xl="3" style={{display: this.state.properties.length > this.page_size ? '': 'none'}}>{this.renderPagination()}</Col>
            </Row>
          </CardBody>
          <CardBody style={{display: this.state.properties.length <= 0 ? '': 'none'}}>
            <h6>Selected service has no properties. Click here <i className="fa fa-plus-square" onClick={e => this.on_add()}></i> to add property.</h6>
          </CardBody>
        </Card>
      </div>
      </Col>
      </Row>
    );
  }
}

export default Widgets;
