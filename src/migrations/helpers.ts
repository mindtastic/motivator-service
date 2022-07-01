import {
  DataTypes,
  QueryInterface,
  ModelAttributes,
} from 'sequelize';
import { MigrationFn, MigrationParams, RunnableMigration } from 'umzug';

export interface SequelizeTableMigrationOptions {
  /**
   * The name of the migration that will be used in the meta table.
   *
   * Default: `create_{tableName}_table`
   */
  migrationName?: string;

  /**
   * If true, passed up and down function will be executed instead
   * getting mixed into the default function.
   *
   * Default: false
   */
  override?: boolean;

  /**
   * Custom up function that will be executed after creating the table.
   * Can be used to alter the table, add foreign_keys, modify different
   * tables, etc.
   *
   * @See override
   */
  up?: MigrationFn<QueryInterface>

  /**
   * Custom down function that will be executed before dropping the table.
   * Can be used to alter the table, dropping foreign_keys, etc.
   *
   * @See override
   */
  down?: MigrationFn<QueryInterface>

  /**
   * Should created_at and updated_at timestamps become added to the
   * created table.
   *
   * Default: true
   */
  timestamps?: boolean;

  /**
   * If paronoid is true, a deleted_at timestamp column will be added
   * to the table.
   *
   * Default: false
   */
  paranoid?: boolean;

}

const defaultCreateTableOptions: SequelizeTableMigrationOptions = {
  override: false,
  timestamps: true,
  paranoid: false,
};

type runnerPrams = MigrationParams<QueryInterface>;

const timestampFields: ModelAttributes = {
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
};

const deletedAtField: ModelAttributes = {
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
};

export const createTableMigration = (
  tableName: string,
  fields: ModelAttributes,
  options: SequelizeTableMigrationOptions,
): RunnableMigration<QueryInterface> => {
  const opts = {
    ...defaultCreateTableOptions,
    ...options,
  };

  return {
    name: opts.migrationName ?? `create_${tableName}_table`,
    up: (opts.override && opts.up) ? opts.up : async (ctx: runnerPrams) => {
      const { context } = ctx;
      await context.createTable(tableName, {
        ...(opts.paranoid && deletedAtField),
        ...(opts.timestamps && timestampFields),
        ...fields,
      });

      if (opts.up) await opts.up(ctx);
    },
    down: (opts.override && opts.down) ? opts.down : async (ctx: runnerPrams) => {
      const { context } = ctx;
      await context.dropTable(tableName);

      if (opts.down) await opts.down(ctx);
    },
  };
};
