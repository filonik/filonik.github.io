import numpy as np

ItemErrors = (TypeError, KeyError, IndexError)

def getitem(obj, key, default=None):
    try:
        return obj[key]
    except ItemErrors:
        return default

def vec_zeros(n):
    result = np.zeros((n,), dtype=np.float32)
    return result

def vec_unit(i, n):
    result = vec_zeros(n)
    if i is not None:
        result[i] = 1
    return result

def mat_identity(n, m):
    result = np.eye(n, m, dtype=np.float32)
    return result

def mat_units(indices, n, m):
    result = np.array([vec_unit(getitem(indices, i), m) for i in range(n)])
    return result

def mat_zeros(n, m):
    result = np.zeros((n, m), dtype=np.float32)
    return result

def transform_identity(n, m):
    result = np.eye(n+1, m+1, dtype=np.float32)
    result[-1,-1] = 1
    return result

def transform_zeros(n, m):
    result = np.zeros((n+1, m+1), dtype=np.float32)
    result[-1,-1] = 1
    return result
    
def transform_rows(values, n=None, m=None):
    _n, _m = values.shape
    n = _n if n is None else n
    m = _m if m is None else m
    _n = min(n, _n)
    _m = min(m, _m)
    result = transform_zeros(n, m)
    result[:_n,:_m] = values[:_n,:_m]
    return result

def transform_cols(values, n=None, m=None):
    return transform_rows(values.T, n=n, m=m)

def transform_unit_rows(indices, n, m):
    return transform_rows(mat_units(indices, n, m), n, m)

def transform_unit_cols(indices, n, m):
    return transform_cols(mat_units(indices, m, n), n, m)

def transform_projection(basis, n=None, m=None):
    return transform_rows(basis, n=n, m=m)

def _translate_indices(n, m):
    return ([n]*m, list(range(m)))

def _scale_indices(n):
    return np.diag_indices(n)

def transform_translate(t, n=None, m=None):
    n = len(t) if n is None else n
    m = len(t) if m is None else m
    result = transform_identity(n, m)
    result[_translate_indices(n, m)] = t
    return result

def transform_scale(s, n=None, m=None):
    n = len(s) if n is None else n
    m = len(s) if m is None else m
    result = transform_identity(n, n)
    result[_scale_indices(n)] = s
    return result

def transform_range_to_normal(lower, upper):
    delta = (upper - lower)
    def _transform_range_to_normal(data):
        n = data.shape[1] - 1
        return transform_translate(-lower) @ transform_scale(2/delta) @ transform_translate(-np.ones(n))
    return _transform_range_to_normal

def transform_normal_to_range(lower, upper):
    delta = (upper - lower)
    def _transform_normal_to_range(data):
        n = data.shape[1] - 1
        return transform_translate(+np.ones(n)) @ transform_scale(delta/2) @ transform_translate(+lower)
    return _transform_normal_to_range

def transform_fit(data):
    lower = np.amin(data[:,:-1], axis=0)
    upper = np.amax(data[:,:-1], axis=0)
    return transform_range_to_normal(lower, upper)(data)

def transform_fit_aspect(data):
    n = data.shape[1] - 1
    lower = np.full((n,), np.amin(data[:,:-1]))
    upper = np.full((n,), np.amax(data[:,:-1]))
    return transform_range_to_normal(lower, upper)(data)

transform_normalise = transform_fit
transform_normalise_aspect = transform_fit_aspect

def transform_parallel_coordinates(i, n, m):
    dx = 2 * i/(n-1) - 1
    return transform_unit_cols([None, i], n, m) @ transform_translate([dx, 0])
