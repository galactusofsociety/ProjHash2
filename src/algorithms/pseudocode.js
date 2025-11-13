export const pseudocode = {
    chaining: {
        insert: [ "1. index = hash(value)", "2. Add value to the list at table[index]" ],
        search: [ "1. index = hash(value)", "2. For each element in list at table[index]:", "3.   If element equals value, return FOUND", "4. Return NOT_FOUND", ],
        delete: [ "1. index = hash(value)", "2. Find element in list at table[index]", "3. If found, remove element from list", "4. Else, do nothing", ],
    },
    linearProbing: {
        insert: [ "1. index = hash(value)", "2. i = 0", "3. while table[(index + i) % size] is not empty or deleted:", "4.   i = i + 1", "5. table[(index + i) % size] = value", ],
        search: [ "1. index = hash(value)", "2. i = 0", "3. while table[(index + i) % size] is not empty:", "4.   If table item equals value, return FOUND", "5.   i = i + 1", "6. Return NOT_FOUND", ],
        delete: [ "1. index = hash(value)", "2. i = 0", "3. while table[(index + i) % size] is not empty:", "4.   If table item equals value, mark as DELETED", "5.   i = i + 1", "6. Return (item not found)", ],
    },
    quadraticProbing: {
        insert: [ "1. index = hash(value)", "2. i = 0", "3. while table[(index + c1*i + c2*i^2) % size] is not empty or deleted:", "4.   i = i + 1", "5. table[(index + c1*i + c2*i^2) % size] = value", ],
        search: [ "1. index = hash(value)", "2. i = 0", "3. while table[(index + c1*i + c2*i^2) % size] is not empty:", "4.   If table item equals value, return FOUND", "5.   i = i + 1", "6. Return NOT_FOUND", ],
        delete: [ "1. index = hash(value)", "2. i = 0", "3. while table[(index + c1*i + c2*i^2) % size] is not empty:", "4.   If table item equals value, mark as DELETED", "5.   i = i + 1", "6. Return (item not found)", ],
    },
    doubleHashing: {
        insert: [ "1. index1 = hash1(value)", "2. index2 = hash2(value)", "3. i = 0", "4. while table[(index1 + i*index2) % size] is not empty or deleted:", "5.   i = i + 1", "6. table[(index1 + i*index2) % size] = value", ],
        search: [ "1. index1 = hash1(value)", "2. index2 = hash2(value)", "3. i = 0", "4. while table[(index1 + i*index2) % size] is not empty:", "5.   If table item equals value, return FOUND", "6.   i = i + 1", "7. Return NOT_FOUND", ],
        delete: [ "1. index1 = hash1(value)", "2. index2 = hash2(value)", "3. i = 0", "4. while table[(index1 + i*index2) % size] is not empty:", "5.   If table item equals value, mark as DELETED", "6.   i = i + 1", "7. Return (item not found)", ],
    },
};