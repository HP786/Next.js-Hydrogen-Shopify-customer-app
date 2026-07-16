'use server';

import { revalidatePath } from 'next/cache';

import { CustomerAccountApiError, queryCustomerAccount } from '@/lib/customer-account/client';
import {
  CREATE_ADDRESS_MUTATION,
  CUSTOMER_UPDATE_MUTATION,
  DELETE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
} from '@/lib/customer-account/queries';

/**
 * @param {unknown} _prevState
 * @param {FormData} formData
 */
export async function updateProfileAction(_prevState, formData) {
  const customer = {};
  for (const key of ['firstName', 'lastName']) {
    const value = String(formData.get(key) ?? '').trim();
    if (value.length > 0) customer[key] = value;
  }

  try {
    const data = await queryCustomerAccount(CUSTOMER_UPDATE_MUTATION, { customer });
    const userErrors = data?.customerUpdate?.userErrors;
    if (userErrors?.length) {
      return { error: userErrors[0].message, customer: null };
    }
    revalidatePath('/account/profile');
    revalidatePath('/account');
    return { error: null, customer: data.customerUpdate.customer };
  } catch (error) {
    return { error: error instanceof CustomerAccountApiError ? error.message : 'Something went wrong.', customer: null };
  }
}

function addressFromFormData(formData) {
  const address = {};
  for (const key of ['address1', 'address2', 'city', 'company', 'territoryCode', 'firstName', 'lastName', 'phoneNumber', 'zoneCode', 'zip']) {
    const value = formData.get(key);
    if (value != null) address[key] = String(value);
  }
  return address;
}

/**
 * @param {unknown} _prevState
 * @param {FormData} formData
 */
export async function createAddressAction(_prevState, formData) {
  const address = addressFromFormData(formData);
  const defaultAddress = formData.get('defaultAddress') === 'on';

  try {
    const data = await queryCustomerAccount(CREATE_ADDRESS_MUTATION, { address, defaultAddress });
    const userErrors = data?.customerAddressCreate?.userErrors;
    if (userErrors?.length) return { error: userErrors[0].message };
    revalidatePath('/account/addresses');
    return { error: null };
  } catch (error) {
    return { error: error instanceof CustomerAccountApiError ? error.message : 'Something went wrong.' };
  }
}

/**
 * @param {unknown} _prevState
 * @param {FormData} formData
 */
export async function updateAddressAction(_prevState, formData) {
  const addressId = formData.get('addressId');
  if (!addressId) return { error: 'Missing address id.' };

  const address = addressFromFormData(formData);
  const defaultAddress = formData.get('defaultAddress') === 'on';

  try {
    const data = await queryCustomerAccount(UPDATE_ADDRESS_MUTATION, {
      address,
      addressId: decodeURIComponent(String(addressId)),
      defaultAddress,
    });
    const userErrors = data?.customerAddressUpdate?.userErrors;
    if (userErrors?.length) return { error: userErrors[0].message };
    revalidatePath('/account/addresses');
    return { error: null };
  } catch (error) {
    return { error: error instanceof CustomerAccountApiError ? error.message : 'Something went wrong.' };
  }
}

/**
 * @param {unknown} _prevState
 * @param {FormData} formData
 */
export async function deleteAddressAction(_prevState, formData) {
  const addressId = formData.get('addressId');
  if (!addressId) return { error: 'Missing address id.' };

  try {
    const data = await queryCustomerAccount(DELETE_ADDRESS_MUTATION, { addressId: decodeURIComponent(String(addressId)) });
    const userErrors = data?.customerAddressDelete?.userErrors;
    if (userErrors?.length) return { error: userErrors[0].message };
    revalidatePath('/account/addresses');
    return { error: null };
  } catch (error) {
    return { error: error instanceof CustomerAccountApiError ? error.message : 'Something went wrong.' };
  }
}
