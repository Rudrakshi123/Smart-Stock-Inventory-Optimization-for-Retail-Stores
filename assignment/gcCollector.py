import gc


def fun(i):
    x = {}
    x[i + 1] = x
    return x


c = gc.collect()
print(c)

for i in range(10):
    fun(i)

c = gc.collect()
print(c)
