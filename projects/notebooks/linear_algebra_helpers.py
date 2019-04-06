import numpy as np

def vec_zeros(n):
    result = np.zeros((n,), dtype=np.float32)
    return result

def vec_unit(i, n):
    result = vec_zeros(n)
    result[i] = 1
    return result

def mat_identity(n, m):
    result = np.eye(n, m, dtype=np.float32)
    return result

def mat_zeros(n, m):
    result = np.zeros((n, m), dtype=np.float32)
    return result

def transform_identity(n, m):
    result = np.eye(n+1, m+1, dtype=np.float32)
    return result

def transform_zeros(n, m):
    result = np.zeros((n+1, m+1), dtype=np.float32)
    result[-1,-1] = 1
    return result

def _translate_indices(n):
    return ([n]*n, list(range(n)))

def _scale_indices(n):
    return np.diag_indices(n)

def transform_translate(t, n=None):
    n = len(t) if n is None else n
    result = transform_identity(n, n)
    result[_translate_indices(n)] = t
    return result

def transform_scale(s, n=None):
    n = len(s) if n is None else n
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

def transform_orthogonal_projection(n, m, axes):
    result = transform_zeros(n, m)
    for i in range(m):
        result[:,i] = vec_unit(axes[i], n+1) if i < len(axes) and axes[i] is not None else vec_zeros(n+1)
    return result
