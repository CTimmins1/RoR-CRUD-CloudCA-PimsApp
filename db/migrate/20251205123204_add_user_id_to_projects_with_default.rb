class AddUserIdToProjectsWithDefault < ActiveRecord::Migration[7.0]
  def change
    add_reference :projects, :user, foreign_key: true, null: false, default: 1

    # Remove the default so future projects need explicit user_id
    change_column_default :projects, :user_id, nil

    # Remove null constraint if you want (optional, safe)
    # change_column_null :projects, :user_id, true
  end
end
