// Copyright (c) Microsoft. All rights reserved.

import update from 'immutability-helper';
import { camelCaseReshape, reshape, getItems, stringToBoolean } from 'utilities';

export const toDeviceGroupModel = (deviceGroup = {}) => camelCaseReshape(deviceGroup, {
  'id': 'id',
  'displayName': 'displayName',
  'conditions': 'conditions',
  'eTag': 'eTag'
});

export const toDeviceGroupsModel = (response = {}) => getItems(response)
  .map(toDeviceGroupModel);

export const toCreateDeviceGroupRequestModel = (params = {}) => ({
  DisplayName: params.displayName,
  Conditions: (params.conditions || []).map(condition => reshape(condition, {
    'field': 'Key',
    'operator': 'Operator',
    'value': 'Value'
  }))
});

export const toUpdateDeviceGroupRequestModel = (params = {}) => ({
  Id: params.id,
  ETag: params.eTag,
  DisplayName: params.displayName,
  Conditions: (params.conditions || []).map(condition => reshape(condition, {
    'field': 'Key',
    'operator': 'Operator',
    'value': 'Value'
  }))
});

export const prepareLogoResponse = ({ xhr, response }) => {
  const returnObj = {};
  const isDefault = xhr.getResponseHeader('IsDefault');
  if (!stringToBoolean(isDefault)) {
    const appName = xhr.getResponseHeader('Name');
    if (appName) {
      returnObj['name'] = appName;
    }
    if (response && response.size) {
      returnObj['logo'] = URL.createObjectURL(response);
    }
  }
  return returnObj;
}

export const toSolutionSettingThemeModel = (response = {}) => camelCaseReshape(response, {
  'description': 'description',
  'name': 'name',
  'diagnosticsOptIn': 'diagnosticsOptIn',
  'azureMapsKey': 'azureMapsKey'
});

export const toSolutionSettingActionModel = (action = {}) => {
  const modelData = camelCaseReshape(action, {
    'type': 'id',
    'settings.isEnabled': 'isEnabled',
    'settings.applicationPermissionsAssigned': 'applicationPermissionsAssigned',
    'settings': 'settings'
  });
  return update(modelData, {
    settings: {
      $unset: ['isEnabled', 'applicationPermissionsAssigned']
    }
  });
}

export const toSolutionSettingActionsModel = (response = {}) => getItems(response)
  .map(toSolutionSettingActionModel);

export const packageTypeOptions = ['EdgeManifest'];

export const toNewPackageRequestModel = ({
  type,
  packageFile
}) => {
  const data = new FormData();
  data.append('Type', type);
  data.append('Package', packageFile);
  return data;
}

export const toPackagesModel = (response = {}) => getItems(response)
  .map(toPackageModel);

export const toPackageModel = (response = {}) => {
  return camelCaseReshape(response, {
    'id': 'id',
    'type': 'type',
    'name': 'name',
    'dateCreated': 'dateCreated',
    'content': 'content'
  });
};
