import { type Ref } from 'vue'
import { type MaybeRef } from '@vueuse/core'
import { unref } from 'vue'
import { merge } from 'lodash'

export function mergeRefObject<T extends Ref<Record<string, any>>>(refIns: T, value: MaybeRef<Record<string, any>>) {
  merge(refIns.value, unref(value))
}
