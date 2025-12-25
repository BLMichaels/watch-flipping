'use client';

export function validateWatchData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.brand || data.brand.trim() === '') {
    errors.push('Brand is required');
  }

  if (!data.model || data.model.trim() === '') {
    errors.push('Model is required');
  }

  if (!data.purchasePrice || isNaN(parseFloat(data.purchasePrice)) || parseFloat(data.purchasePrice) <= 0) {
    errors.push('Purchase price must be a positive number');
  }

  if (data.revenueAsIs && (isNaN(parseFloat(data.revenueAsIs)) || parseFloat(data.revenueAsIs) < 0)) {
    errors.push('Revenue (As-Is) must be a non-negative number');
  }

  if (data.revenueCleaned && (isNaN(parseFloat(data.revenueCleaned)) || parseFloat(data.revenueCleaned) < 0)) {
    errors.push('Revenue (Cleaned) must be a non-negative number');
  }

  if (data.revenueServiced && (isNaN(parseFloat(data.revenueServiced)) || parseFloat(data.revenueServiced) < 0)) {
    errors.push('Revenue (Serviced) must be a non-negative number');
  }

  if (data.serviceCost && (isNaN(parseFloat(data.serviceCost)) || parseFloat(data.serviceCost) < 0)) {
    errors.push('Service cost must be a non-negative number');
  }

  if (data.cleaningCost && (isNaN(parseFloat(data.cleaningCost)) || parseFloat(data.cleaningCost) < 0)) {
    errors.push('Cleaning cost must be a non-negative number');
  }

  if (data.otherCosts && (isNaN(parseFloat(data.otherCosts)) || parseFloat(data.otherCosts) < 0)) {
    errors.push('Other costs must be a non-negative number');
  }

  if (data.soldPrice && (isNaN(parseFloat(data.soldPrice)) || parseFloat(data.soldPrice) <= 0)) {
    errors.push('Sold price must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

