class CurrentUserSerializer < ActiveModel::Serializer
  attributes :id, :name, :email, :yearly_reading_goal
end
