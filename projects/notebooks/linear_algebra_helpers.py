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
    
def transform_normalise(data):
    lower = np.amin(data[:,:-1], axis=0)
    upper = np.amax(data[:,:-1], axis=0)
    delta = (upper - lower)
    return transform_translate(-lower) @ transform_scale(2/delta) @ transform_translate(-np.ones(lower.shape))
    
def transform_orthogonal_projection(n, m, axes):
    result = transform_zeros(n, m)
    for i in range(m):
        result[:,i] = vec_unit(axes[i], n+1) if i < len(axes) and axes[i] is not None else vec_zeros(n+1)
    return result

"""
def plots_nd(specifications, count=None, size=None):
    count = (1,1) if count is None else count
    size = (10,10) if size is None else size
    
    fig, axes = plt.subplots(count[0], count[1], figsize=size)
    
    for i, j in np.ndindex(count):
"""