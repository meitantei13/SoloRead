require_relative "guest_sample_data/finished_books_data"
require_relative "guest_sample_data/reading_books_data"

class GuestSampleDataService
  include GuestSampleData

  def self.create_for(user)
    new(user).call
  end

  def initialize(user)
    @user = user
    @genres = {}
  end

  def call
    @user.update!(yearly_reading_goal: 20)
    create_books(FINISHED_BOOKS, status: :finished)
    create_books(READING_BOOKS, status: :reading)
  end

  private

    def genre(name)
      return nil if name.blank?

      @genres[name] ||= Genre.find_by(name: name, is_default: true)
    end

    def create_books(books_data, status:)
      books_data.each_with_index do |data, index|
        Book.create!(
          user: @user,
          status: status,
          title: data[:title],
          author: data[:author],
          genre: genre(data[:genre]),
          content: data[:content],
          read_date: (status == :finished) ? (index + 1).weeks.ago.to_date : nil,
          image_url: data[:image_url],
        )
      end
    end
end
