import React, { Component } from 'react';
import { DropdownItem, DropdownMenu, DropdownToggle, Nav} from 'reactstrap';
import PropTypes from 'prop-types';

import { AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo2.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 150, height: 54, alt: 'Breeze Logo' }}
          minimized={{ src: logo, width: 30, height: 30, alt: 'Breeze Logo' }}
        />

        <Nav className="ml-auto" navbar>
          <AppHeaderDropdown direction="down">
            <DropdownToggle nav>
              <img src={'assets/img/avatars/1.png'} className="img-avatar" alt="env" />
            </DropdownToggle>
            <DropdownMenu right style={{ right: 'auto' }}>
              <DropdownItem header tag="div" className="text-center"><strong>Environments</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> DEV</DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> QA</DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> DEMO</DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> PROD A</DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> PROD B</DropdownItem>
            </DropdownMenu>
          </AppHeaderDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
