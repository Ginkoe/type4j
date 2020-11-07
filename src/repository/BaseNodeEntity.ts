import { stringify } from "querystring";
import { getConnection } from "..";
import { QueryBuilder } from "../query/QueryBuilder";

export class BaseNodeEntity {
  readonly id: number;

  static _findProps(entity: BaseNodeEntity): any {
    const props = {};
    Object.keys(entity).forEach((prop) => {
      if (Reflect.getMetadata("isNodeProp", entity, prop))
        props[prop] = entity[prop];
    });
    return props;
  }

  _getNodeType() {
    const _reflectedName = Reflect.getMetadata("4jNodeName", this);
    return _reflectedName;
  }

  async save(): Promise<this> {
    const queryBuilder = new QueryBuilder();

    const selfIndice = queryBuilder.create(this).getEntityIndice(this);
    queryBuilder.ret([`ID(${selfIndice})`]);

    //TODO: Really not how I imagine it, but does the job for now. Need to learn more about Cypher first.
    (<any>this).id = (await queryBuilder.run(getConnection())).records[0].get(
      0
    ).low;

    return this;
  }
}
