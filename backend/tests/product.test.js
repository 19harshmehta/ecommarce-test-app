const { getOrderBy } = require('../controllers/product');

describe('Product sorting', () => {

  
  it('returns asc if header set with field', () => {
    const req = { headers: { 'x-evaluator-sort': 'price_asc' }, query: {} };
    const orderBy = getOrderBy(req);
    expect(orderBy).toEqual({ price: 'asc' });
  });



  it('returns desc by default', () => {
    const req = { headers: {}, query: {} };
    const orderBy = getOrderBy(req);
    expect(orderBy).toEqual({ price: 'desc' });
  });

});