import React from 'react';
import classNames from 'classnames';
import RendezvousForm from './RendezvousForm';
import PriceForm from './PriceForm';
import PriceTable from './PriceTable';

function Options({ className, ...rest }) {
  return (
    <div className={classNames(className, 'p-4')} {...rest}>
      <div className="flex mb-4">
        <RendezvousForm className="flex-grow mr-4" />
        <PriceForm className="flex-grow" />
      </div>
      <PriceTable />
    </div>
  );
}

export default Options;
