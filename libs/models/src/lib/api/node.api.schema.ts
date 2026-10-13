import { z } from 'zod';
import { VALIDATION_MESSAGES as V } from './constants';
import { requiredString, messageOutput } from './common.schema';
import { nodeSchema } from './entities.schema';

const nodeFields = {
  order: z.number({ error: V.NODE_ORDER_INVALID }),
  name: requiredString(V.NODE_NAME_REQUIRED),
  path: requiredString(V.NODE_PATH_REQUIRED),
  role: z.array(requiredString(V.ROLE_REQUIRED)).min(1, V.NODE_ROLE_REQUIRED),
  icon: requiredString(V.NODE_ICON_REQUIRED),
};

// Inputs

export const getNodesInput = z.object({ role: requiredString(V.ROLE_REQUIRED) });

export const createNodeInput = z.object(nodeFields);

export const editNodeInput = z.object({
  nodeName: requiredString(V.NODE_NAME_REQUIRED),
  data: z.object(nodeFields).partial(),
});

export const deleteNodeInput = z.object({ nodeName: requiredString(V.NODE_NAME_REQUIRED) });

// Outputs

export const nodeOutput = nodeSchema;
export const nodesOutput = z.array(nodeSchema);

export { messageOutput };
