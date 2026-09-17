import { ProductItem, NormalizedProduct, UnitPriceResult } from './types';

/**
 * 2. 단위 가격 비교 계산기 (단가 계산기)
 * 용량(g, kg, ml, L, 개수 등)과 가격이 다른 상품들을 100g, 100ml, 1개당 단가로 표준화하여 최저가 및 차이율을 비교합니다.
 */
export function calculateUnitPrice(products: ProductItem[]): UnitPriceResult {
  const validProducts = products.filter((p) => p.price > 0 && p.capacity > 0);

  if (validProducts.length === 0) {
    return {
      products: [],
      bestDealId: null,
      baseUnitLabel: '100g/100ml/1개',
    };
  }

  // 첫 번째 상품의 단위를 보고 기준 결정 (무게, 부피, 개수)
  const firstUnit = validProducts[0].unit;
  let baseUnitLabel = '100g';
  if (firstUnit === 'ml' || firstUnit === 'L') {
    baseUnitLabel = '100ml';
  } else if (firstUnit === 'count') {
    baseUnitLabel = '1개';
  }

  const normalizedList: {
    item: ProductItem;
    capacityInBase: number;
    unitPrice100: number;
  }[] = validProducts.map((item) => {
    let capacityInBase = item.capacity;
    let multiplier = 100;

    if (item.unit === 'kg') {
      capacityInBase = item.capacity * 1000;
      multiplier = 100;
    } else if (item.unit === 'g') {
      capacityInBase = item.capacity;
      multiplier = 100;
    } else if (item.unit === 'L') {
      capacityInBase = item.capacity * 1000;
      multiplier = 100;
    } else if (item.unit === 'ml') {
      capacityInBase = item.capacity;
      multiplier = 100;
    } else if (item.unit === 'count') {
      capacityInBase = item.capacity;
      multiplier = 1; // 1개당
    }

    const unitPrice100 = (item.price / capacityInBase) * multiplier;

    return {
      item,
      capacityInBase,
      unitPrice100: Math.round((unitPrice100 + Number.EPSILON) * 100) / 100,
    };
  });

  // 최저가 찾기
  let minPrice = Infinity;
  let bestDealId: string | null = null;

  normalizedList.forEach((n) => {
    if (n.unitPrice100 < minPrice) {
      minPrice = n.unitPrice100;
      bestDealId = n.item.id;
    }
  });

  const finalProducts: NormalizedProduct[] = normalizedList.map((n) => {
    const isBestDeal = n.item.id === bestDealId;
    let priceDiffPercent = 0;
    if (minPrice > 0) {
      priceDiffPercent = ((n.unitPrice100 - minPrice) / minPrice) * 100;
      priceDiffPercent = Math.round((priceDiffPercent + Number.EPSILON) * 100) / 100;
    }

    return {
      ...n.item,
      capacityInBase: n.capacityInBase,
      unitPrice100: n.unitPrice100,
      priceDiffPercent,
      isBestDeal,
    };
  });

  return {
    products: finalProducts,
    bestDealId,
    baseUnitLabel,
  };
}
