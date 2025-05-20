import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';

const StockUpdateSchema = Yup.object().shape({
  quantity: Yup.number()
    .required('Quantity is required')
    .integer('Quantity must be a whole number')
    .min(0, 'Quantity cannot be negative'),
  reason: Yup.string()
    .required('Reason is required')
    .min(3, 'Reason must be at least 3 characters')
});

const StockUpdateForm = ({ item, onSubmit, onCancel }) => {
  const [isAdjustment, setIsAdjustment] = useState(false);

  return (
    <Formik
      initialValues={{ 
        quantity: item.quantity || 0, 
        adjustment: 0,
        reason: '',
      }}
      validationSchema={StockUpdateSchema}
      onSubmit={(values) => {
        // If using adjustment, calculate new quantity
        const finalValues = isAdjustment 
          ? { 
              quantity: parseInt(item.quantity) + parseInt(values.adjustment),
              reason: values.reason 
            }
          : { 
              quantity: parseInt(values.quantity),
              reason: values.reason 
            };
        
        onSubmit(finalValues);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="space-y-4">
          <div className="mb-4">
            <div className="flex items-center space-x-4 mb-2">
              <span className="font-medium">Product:</span>
              <span>{item.productName}</span>
            </div>
            <div className="flex items-center space-x-4 mb-2">
              <span className="font-medium">Current Quantity:</span>
              <span>{item.quantity}</span>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex items-center mb-2">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  className="form-radio"
                  name="stockUpdateType"
                  checked={!isAdjustment}
                  onChange={() => setIsAdjustment(false)}
                />
                <span className="ml-2">Set new quantity</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="stockUpdateType"
                  checked={isAdjustment}
                  onChange={() => setIsAdjustment(true)}
                />
                <span className="ml-2">Adjust quantity</span>
              </label>
            </div>
            
            <div className="mt-3">
              <label htmlFor={isAdjustment ? 'adjustment' : 'quantity'} className="block text-sm font-medium text-gray-700">
                {isAdjustment ? 'Adjustment' : 'New Quantity'}
              </label>
              <Field
                name={isAdjustment ? 'adjustment' : 'quantity'}
                type="number"
                id={isAdjustment ? 'adjustment' : 'quantity'}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <ErrorMessage name={isAdjustment ? 'adjustment' : 'quantity'} component="div" className="text-red-500 text-sm mt-1" />
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
              Reason for Update
            </label>
            <Field
              as="textarea"
              name="reason"
              id="reason"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Why are you updating this stock?"
            />
            <ErrorMessage name="reason" component="div" className="text-red-500 text-sm mt-1" />
          </div>

          <div className="flex justify-end space-x-3 mt-4">
            <Button 
              type="button" 
              onClick={onCancel} 
              variant="outline"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Stock'}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default StockUpdateForm;